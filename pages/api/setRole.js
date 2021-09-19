import { Contract, providers, utils } from "ethers";
import ABI from "./abi.json";
import { getSession } from "next-auth/client";

const rpc = new providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/fde9986431614271aeacb5ad8d709168"
);

const mgAddress = "0x2bd58a19c7e4abf17638c5ee6fa96ee5eb53aed9";
const guildId = "888907382816636939";
const mannysGame = new Contract(mgAddress, ABI, rpc);

const roleMap = {
  Golden: "889007750493896745",
  Zombie: "889009288792637451",
  Inverted: "889010631552958484",
  Silver: "889011154570063873",
  Stone: "889011257024344064",
  Holo: "889011581134983188",
  Albino: "889011358690058260",
  "Base Rare": "889154168701480970",
  Gamer: "889003509511495691",
};

const rolePicker = (ownedTokens) => {
  const tokenMap = {
    Golden: [404],
    Zombie: [13, 143, 180, 255, 363],
    Inverted: [
      10, 17, 44, 60, 64, 77, 78, 144, 155, 165, 168, 216, 219, 298, 329, 397,
    ],
    Silver: [
      7, 24, 66, 76, 85, 127, 148, 167, 172, 186, 210, 287, 303, 304, 348, 396,
    ],
    Stone: [
      11, 33, 36, 58, 108, 138, 171, 173, 184, 190, 209, 231, 234, 244, 308,
      332,
    ],
    Albino: [
      59, 91, 93, 94, 115, 118, 119, 141, 145, 150, 160, 179, 192, 195, 235,
      237, 271, 273, 291, 297, 325, 326, 381, 401,
    ],
    Holo: [
      42, 90, 92, 98, 122, 124, 132, 156, 162, 182, 197, 206, 240, 242, 253,
      306, 335, 341, 351, 382, 387, 390, 391, 399,
    ],
  };

  const roles = [];
  if (ownedTokens.length) {
    roles.push(roleMap["Gamer"]);
  }
  ownedTokens.forEach((token) => {
    let isBase = token <= 403;

    Object.keys(tokenMap).forEach((role) => {
      if (tokenMap[role].some((roleId) => roleId === token)) {
        if (!roles.includes(roleMap[role])) {
          roles.push(roleMap[role]);
        }
        isBase = false;
      }
    });

    if (isBase && !roles.includes(roleMap["Base Rare"])) {
      roles.push(roleMap["Base Rare"]);
    }
  });

  return roles;
};

export default async (req, res) => {
  const session = await getSession({ req });
  const { sig } = JSON.parse(req.body);
  const address = utils.verifyMessage("Claiming Discord Roles", sig);
  const ownedTokens = await mannysGame.tokensByOwner(address);
  const newRoles = rolePicker(ownedTokens);

  const existingRoles = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${session.userId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => data.roles);

  const addRoles = newRoles.filter((roleId) => !existingRoles.includes(roleId));
  // remove token roles if no longer owns
  const removeRoles = [];
  Object.keys(roleMap).map((roleKey) => {
    const roleId = roleMap[roleKey];
    if (existingRoles.includes(roleId) && !newRoles.includes(roleId)) {
      removeRoles.push(roleId);
    }
  });

  const result = await Promise.all([
    addRoles.map(async (roleId) => {
      return fetch(
        `https://discord.com/api/guilds/${guildId}/members/${session.userId}/roles/${roleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );
    }),
    removeRoles.map(async (roleId) => {
      return fetch(
        `https://discord.com/api/guilds/${guildId}/members/${session.userId}/roles/${roleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );
    }),
  ]).catch((error) => {
    return {
      statusCode: 200,
      body: JSON.stringify(error),
    };
  });

  const roleNames = newRoles.map((nr) =>
    Object.keys(roleMap).find((rm) => roleMap[rm] === nr)
  );

  res.send(JSON.stringify({ rolesEarned: roleNames, result }));
};
