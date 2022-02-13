import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import Web3Modal from "web3modal";
import useUserProviderAndSigner from "../hooks/useUserProviderAndSigner";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Authereum from "authereum";

const { ethers } = require("ethers");

// create our app context
export const Web3Context = React.createContext({});

// provider Component that wraps the entire app and provides context variables
export function Web3Provider({ children, ...props }) {
  // for Nextjs Builds, return null until "window" is available
  if (!global.window) {
    return null;
  }

  // app states
  const [checkedProvider, setCheckedProvider] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState();

  const signer = useUserProviderAndSigner(injectedProvider);
  const [address, setAddress] = useState();

  const mainnetInfura = useMemo(() => {
    return navigator.onLine
      ? new ethers.providers.StaticJsonRpcProvider(
          `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
        )
      : null;
  }, [navigator.onLine]);

  /*
    Web3 modal helps us "connect" external wallets:
  */
  const web3Modal = useMemo(() => {
    // Coinbase walletLink init
    const walletLink = new WalletLink({
      appName: "coinbase",
    });

    // WalletLink provider
    const walletLinkProvider = walletLink.makeWeb3Provider(
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      1
    );

    // Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
    return new Web3Modal({
      network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
      cacheProvider: true, // optional
      theme: "dark", // optional. Change to "dark" for a dark theme.
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            bridge: "https://polygon.bridge.walletconnect.org",
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
            rpc: {
              1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
              42: `https://kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
              100: "https://dai.poa.network", // xDai
            },
          },
        },
        portis: {
          display: {
            logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
            name: "Portis",
            description: "Connect to Portis App",
          },
          package: Portis,
          options: {
            id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
          },
        },
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: "pk_live_5A7C91B2FC585A17", // required
          },
        },
        "custom-walletlink": {
          display: {
            logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
            name: "Coinbase",
            description: "Connect to Coinbase Wallet (not Coinbase App)",
          },
          package: walletLinkProvider,
          connector: async (provider, _options) => {
            await provider.enable();
            return provider;
          },
        },
        authereum: {
          package: Authereum, // required
        },
      },
    });
  }, []);

  const mainnetProvider = mainnetInfura;

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  useEffect(() => {
    async function getAddress() {
      if (signer) {
        const newAddress = await signer.getAddress();
        setAddress(newAddress);
        setCheckedProvider(true);
      }
    }
    getAddress();
  }, [signer]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect().catch((e) => {
      console.error(e);
    });
    if (!provider) {
      setCheckedProvider(true);
      return;
    }
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", (chainId) => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      loadWeb3Modal();
    } else {
      setCheckedProvider(true);
    }
  }, [web3Modal]);

  // use props as a way to pass configuration values
  const providerProps = {
    ...props,
    injectedProvider,
    checkedProvider,
    signer,
    mainnetProvider,
    address,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
  };

  return (
    <Web3Context.Provider value={providerProps}>
      {children}
    </Web3Context.Provider>
  );
}

export function Web3Consumer(Component) {
  return function HOC(pageProps) {
    return (
      <Web3Context.Consumer>
        {(web3Values) => <Component web3={web3Values} {...pageProps} />}
      </Web3Context.Consumer>
    );
  };
}
