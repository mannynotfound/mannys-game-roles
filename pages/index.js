import { signIn, useSession } from "next-auth/client";
import React, { useState } from "react";
import Scene from "../components/Scene";
import { Web3Consumer } from "../helpers/web3context";
import { CHEERING } from "../components/Manny";

const getColor = (role) => {
  const roleMap = {
    Golden: "#ffd700",
    Zombie: "#440415",
    Inverted: "#016fe9",
    Silver: "#979C9F",
    Stone: "#546E7A",
    Holo: "#7feeff",
    Albino: "#fff",
    "Base Rare": "#d19d72",
    Gamer: "#70bf44",
    "Special Edition": "#E91E63",
    Legendary: "#C27C0E",
  };

  return roleMap[role];
};

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="30"
    height="30"
    viewBox="0 0 24 24"
  >
    {" "}
    <path
      fill="currentColor"
      d="M19.952,5.672c-1.904-1.531-4.916-1.79-5.044-1.801c-0.201-0.017-0.392,0.097-0.474,0.281 c-0.006,0.012-0.072,0.163-0.145,0.398c1.259,0.212,2.806,0.64,4.206,1.509c0.224,0.139,0.293,0.434,0.154,0.659 c-0.09,0.146-0.247,0.226-0.407,0.226c-0.086,0-0.173-0.023-0.252-0.072C15.584,5.38,12.578,5.305,12,5.305S8.415,5.38,6.011,6.872 c-0.225,0.14-0.519,0.07-0.659-0.154c-0.14-0.225-0.07-0.519,0.154-0.659c1.4-0.868,2.946-1.297,4.206-1.509 c-0.074-0.236-0.14-0.386-0.145-0.398C9.484,3.968,9.294,3.852,9.092,3.872c-0.127,0.01-3.139,0.269-5.069,1.822 C3.015,6.625,1,12.073,1,16.783c0,0.083,0.022,0.165,0.063,0.237c1.391,2.443,5.185,3.083,6.05,3.111c0.005,0,0.01,0,0.015,0 c0.153,0,0.297-0.073,0.387-0.197l0.875-1.202c-2.359-0.61-3.564-1.645-3.634-1.706c-0.198-0.175-0.217-0.477-0.042-0.675 c0.175-0.198,0.476-0.217,0.674-0.043c0.029,0.026,2.248,1.909,6.612,1.909c4.372,0,6.591-1.891,6.613-1.91 c0.198-0.172,0.5-0.154,0.674,0.045c0.174,0.198,0.155,0.499-0.042,0.673c-0.07,0.062-1.275,1.096-3.634,1.706l0.875,1.202 c0.09,0.124,0.234,0.197,0.387,0.197c0.005,0,0.01,0,0.015,0c0.865-0.027,4.659-0.667,6.05-3.111 C22.978,16.947,23,16.866,23,16.783C23,12.073,20.985,6.625,19.952,5.672z M8.891,14.87c-0.924,0-1.674-0.857-1.674-1.913 s0.749-1.913,1.674-1.913s1.674,0.857,1.674,1.913S9.816,14.87,8.891,14.87z M15.109,14.87c-0.924,0-1.674-0.857-1.674-1.913 s0.749-1.913,1.674-1.913c0.924,0,1.674,0.857,1.674,1.913S16.033,14.87,15.109,14.87z"
    />
  </svg>
);

const EthIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    width="30"
    height="30"
    viewBox="0 0 784.37 1277.39"
  >
    <g>
      <g fillRule="nonzero">
        <path
          fill="currentColor"
          d="M392.07 0L383.5 29.11 383.5 873.74 392.07 882.29 784.13 650.54z"
        ></path>
        <path
          fill="currentColor"
          d="M392.07 0L0 650.54 392.07 882.29 392.07 472.33z"
        ></path>
        <path
          fill="currentColor"
          d="M392.07 956.52L387.24 962.41 387.24 1263.28 392.07 1277.38 784.37 724.89z"
        ></path>
        <path
          fill="currentColor"
          d="M392.07 1277.38L392.07 956.52 0 724.89z"
        ></path>
        <path
          fill="currentColor"
          d="M392.07 882.29L784.13 650.54 392.07 472.33z"
        ></path>
        <path
          fill="currentColor"
          d="M0 650.54L392.07 882.29 392.07 472.33z"
        ></path>
      </g>
    </g>
  </svg>
);

function Page({ web3 }) {
  console.log(web3);
  const [session] = useSession();
  const [rolesSet, setRoles] = useState(null);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const assignRoles = async () => {
    const sig = await web3.signer
      .signMessage("Claiming Discord Roles")
      .catch((error) => alert(error.message));

    if (!sig) {
      return null;
    }

    return fetch("/api/setRole", {
      body: JSON.stringify({
        sig,
      }),
      method: "POST",
    }).then((response) => {
      return response.json();
    });
  };

  const doAssignRoles = async () => {
    setLoadingRoles(true);
    const rolesResponse = await assignRoles();
    setRoles(rolesResponse);
    setLoadingRoles(false);
  };

  let Body = null;
  const sceneProps = {};

  if (!session) {
    Body = (
      <>
        <h2
          style={{
            letterSpacing: -0.8,
            margin: "0 0 10px 0",
            fontWeight: "bolder",
          }}
        >
          Own a{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://opensea.io/collection/mannys-game"
          >
            manny?
          </a>
        </h2>
        <h3 style={{ letterSpacing: -0.8, margin: 0 }}>
          Authenticate via Discord to unlock holder channels.
        </h3>
        <div
          className="discord-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 10,
          }}
          onClick={() => signIn("discord")}
        >
          <DiscordIcon />
          <h2 style={{ margin: "0 0 0 20px" }}>Authenticate</h2>
        </div>
      </>
    );
  } else if (session && web3.address) {
    Body = (
      <>
        <h3
          style={{
            letterSpacing: -0.8,
            margin: "0 0 10px 0",
            fontWeight: "bolder",
          }}
        >
          Connected as{" ..."}
          {web3.address.substring(web3.address.length - 4, web3.address.length)}
          <br />
          Sign a message with your Web3 provider to claim your roles
        </h3>
        <div
          className="btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 10,
          }}
          onClick={doAssignRoles}
        >
          <EthIcon />
          <h2 style={{ margin: "0 0 0 10px" }}>Sign</h2>
        </div>
      </>
    );
  } else if (session) {
    Body = (
      <>
        <h3
          style={{
            letterSpacing: -0.8,
            margin: "0 0 10px 0",
            fontWeight: "bolder",
          }}
        >
          Connect your wallet
        </h3>
        <div
          className="btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 10,
          }}
          onClick={web3.loadWeb3Modal}
        >
          <EthIcon />
          <h2 style={{ margin: "0 0 0 10px" }}>Connect</h2>
        </div>
      </>
    );
  }

  if (loadingRoles) {
    Body = <p>Trying to set roles.....</p>;
  }

  if (rolesSet?.rolesEarned?.length) {
    sceneProps.animation = CHEERING;
    Body = (
      <>
        <h2
          style={{
            letterSpacing: -0.8,
            margin: "0 0 10px 0",
            fontWeight: "bolder",
          }}
        >
          Claimed Roles:
        </h2>
        <div>
          {rolesSet.rolesEarned.map((role) => (
            <div
              style={{
                display: "inline-block",
                borderRadius: 5,
                padding: 10,
                margin: 5,
                backgroundColor: getColor(role),
                color: "black",
                fontWeight: "bold",
              }}
              key={role}
            >
              {role}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 20 }}>
          <a
            className="discord-btn"
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/Mxb9jWekFV"
            style={{
              display: "inline-flex",
              flex: 1,
              alignItems: "center",
              textAlign: "left",
              padding: "5px 10px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            <DiscordIcon />
            <h4 style={{ margin: "0 0 0 10px" }}>Launch Discord</h4>
          </a>
          <a
            className="btn"
            target="_blank"
            rel="noreferrer"
            href="https://mannys.game/achievements"
            style={{
              display: "inline-flex",
              flex: 1,
              alignItems: "center",
              marginLeft: 10,
              padding: "5px 10px",
              borderRadius: 10,
              textDecoration: "none",
              textAlign: "left",
            }}
          >
            <img src="/assets/goldmanny.png" width="30" height="auto" />
            <h4 style={{ margin: "0 0 0 10px" }}>Check Achievements</h4>
          </a>
        </div>
      </>
    );
  }

  return (
    <main id="App">
      <div className="masthead">
        <div
          className="inner"
          style={{
            maxWidth: 333,
            margin: "20px auto",
            textAlign: "center",
          }}
        >
          {Body}
        </div>
      </div>
      <Scene {...sceneProps} />
    </main>
  );
}

export default Web3Consumer(Page);
