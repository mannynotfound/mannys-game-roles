import { useState, useEffect } from "react";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ethers, Signer } from "ethers";

export const parseProviderOrSigner = async (providerOrSigner) => {
  let signer;
  let provider = ethers.providers.Provider;
  let providerNetwork = ethers.providers.Network;

  if (
    providerOrSigner &&
    (providerOrSigner instanceof JsonRpcProvider ||
      providerOrSigner instanceof Web3Provider)
  ) {
    const accounts = await providerOrSigner.listAccounts();
    if (accounts && accounts.length > 0) {
      signer = providerOrSigner.getSigner();
    }
    provider = providerOrSigner;
    providerNetwork = await providerOrSigner.getNetwork();
  }

  if (!signer && providerOrSigner instanceof Signer) {
    signer = providerOrSigner;
    provider = signer.provider;
    providerNetwork = provider && (await provider.getNetwork());
  }
  return { signer, provider, providerNetwork };
};

/**
 * Get the address from the current signer or provider
 * @param providerOrSigner
 * @returns (string) :: address
 */
const useUserProviderAndSigner = (providerOrSigner) => {
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const getSigner = async (providerOrSigner) => {
      const result = await parseProviderOrSigner(providerOrSigner);
      if (result.signer) {
        setSigner(result.signer);
      }
    };

    if (providerOrSigner) getSigner(providerOrSigner);
  }, [providerOrSigner]);

  return signer;
};

export default useUserProviderAndSigner;
