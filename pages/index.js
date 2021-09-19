import { signIn, useSession } from "next-auth/client";
import React, { useState } from "react";
import Web3 from "web3";

const assignRoles = async () => {
  let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  const accounts = await web3.eth.requestAccounts();

  const sig = await web3.eth.personal.sign(
    "Claiming Discord Roles",
    accounts[0]
  );

  return fetch("/api/setRole", {
    body: JSON.stringify({
      sig,
    }),
    method: "POST",
  }).then((response) => {
    return response.json();
  });
};

function Page() {
  const [session] = useSession();
  const [rolesSet, setRoles] = useState(null);

  const doAssignRoles = async () => {
    const rolesResponse = await assignRoles();
    setRoles(rolesResponse);
  };

  if (rolesSet) {
    return (
      <>
        <h3>Successfully set roles: </h3>
        <code>{JSON.stringify(rolesSet, 0, 2)}</code>
      </>
    );
  }

  return (
    <main>
      {!session && (
        <div>
          <p>
            Member of our{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/Mxb9jWekFV"
            >
              Discord community
            </a>
            ? Auth your Discord to get roles for the manny tokens you own!
          </p>
          <button onClick={() => signIn()}>Auth Discord</button>
        </div>
      )}
      {session && (
        <div>
          <p>To claim your roles, sign a message</p>
          <button onClick={doAssignRoles}>Sign Message</button>
        </div>
      )}
    </main>
  );
}

export default Page;
