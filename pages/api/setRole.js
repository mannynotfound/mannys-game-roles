import { Contract, providers, utils } from "ethers";
import ABI from "./abi.json";
import { getSession } from "next-auth/client";

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const rpc = new providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`
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
  "Special Edition": "929431355442466937",
  Legendary: "929431814567763968",
};

const skinMap = {
  Zombie: {
    tokens: [13, 143, 180, 255, 363],
    description: "The second most rare Manny is an homage to cryptopunks.",
    emoji: "zombie",
  },
  Inverted: {
    tokens: [
      10, 17, 44, 60, 64, 77, 78, 144, 155, 165, 168, 216, 219, 298, 329, 397,
    ],
    description: "A rare Manny created with ctrl+i in photoshop.",
    emoji: "inverted",
  },
  Silver: {
    tokens: [
      7, 24, 66, 76, 85, 127, 148, 167, 172, 186, 210, 287, 303, 304, 348, 396,
    ],
    description: "A rare Manny paying tribute to Manny's silver collection.",
    emoji: "silver",
  },
  Stone: {
    tokens: [
      11, 33, 36, 58, 108, 138, 171, 173, 184, 190, 209, 231, 234, 244, 308,
      332,
    ],
    description: "A rare Manny evoking materiality and sculpture.",
    emoji: "stone",
  },
  Albino: {
    tokens: [
      59, 91, 93, 94, 115, 118, 119, 141, 145, 150, 160, 179, 192, 195, 235,
      237, 271, 273, 291, 297, 325, 326, 381, 401,
    ],
    description: "A rare Manny in the style of an albino animal.",
    emoji: "albino",
  },
  Holo: {
    tokens: [
      42, 90, 92, 98, 122, 124, 132, 156, 162, 182, 197, 206, 240, 242, 253,
      306, 335, 341, 351, 382, 387, 390, 391, 399,
    ],
    description: "A rare Manny inspired by holographic trading cards.",
    emoji: "holo",
  },
  Gold: {
    tokens: [404],
    description: "The holy grail of mannys.game.",
    emoji: "gold",
  },
  "Base Rare": {
    description: "Entry-level rare Manny.",
    tokens: [],
    emoji: "baserare",
  },
  Blitmap: {
    tokens: [
      23, 47, 125, 128, 211, 257, 340, 1606, 1596, 1474, 976, 809, 544, 1085,
      1465, 646,
    ],
    description: "A rare manny using cc0 artwork from the Blitmap universe.",
    se: true,
    emoji: "blitmap",
  },
  Burnt: {
    tokens: [
      2, 147, 254, 265, 349, 357, 728, 637, 1315, 906, 1364, 1571, 751, 1332,
      1413, 1228,
    ],
    description: "A rare manny that's been burnt by one too many crypto scams.",
    se: true,
    emoji: "burnt",
  },
  "Eco-Friendly": {
    tokens: [
      123, 199, 212, 217, 232, 284, 389, 1573, 718, 1494, 1565, 490, 1199, 1331,
      1318, 1156,
    ],
    description:
      "A rare manny celebrating nature, not backed by carbon offsets.",
    se: true,
    emoji: "ecofriendly",
  },
  Mannydenza: {
    tokens: [
      50, 252, 34, 247, 665, 983, 1010, 1036, 1292, 1030, 831, 1361, 550, 748,
      780, 1152,
    ],
    description:
      "A rare manny with patterns generated by one of the most versatile algorithms to date.",
    se: true,
    emoji: "mannydenza",
  },
  "Right-Clicked": {
    tokens: [
      142, 187, 241, 281, 899, 910, 1563, 1145, 577, 1390, 966, 1300, 1247,
      1174, 1056, 1484,
    ],
    description:
      "A rare manny that's been right clicked and saved by too many NFT haters.",
    se: true,
    emoji: "rightclicked",
  },
  Rugged: {
    tokens: [
      126, 185, 248, 299, 999, 1139, 626, 1161, 1398, 1378, 711, 1528, 1444,
      1447, 1197, 437,
    ],
    description:
      "A rare manny that's draped in the artwork of the finest pixel rug from rugstore.exchange.",
    se: true,
    emoji: "rugged",
  },
  Matrix: {
    tokens: [355],
    description: "A legendary manny that took the red pill.",
    se: true,
    emoji: "matrix",
  },
  "Skull Trooper": {
    tokens: [398],
    description: "A legendary manny that started playing in season one.",
    se: true,
    emoji: "skulltrooper",
  },
  Pixelated: {
    tokens: [903],
    description:
      "A legendary manny rendered as pixel art by artist Mykola Dosenko.",
    se: true,
    emoji: "pixelated",
  },
  "Poorly Drawn": {
    tokens: [1248],
    description: "A legendary manny hand drawn (poorly) by the artist himself.",
    se: true,
    emoji: "poorlydrawn",
  },
  "Dr. Mannyhattan": {
    tokens: [1351],
    description: "A legendary manny who's tired of Earth.",
    se: true,
    emoji: "drmannyhattan",
  },
  Ditto: {
    tokens: [1429],
    description:
      "A legendary manny that can reconstitute its entire cellular structure into what it sees.",
    se: true,
    emoji: "ditto",
  },
  Galaxy: {
    tokens: [484],
    description: "A legendary manny created by Mika.",
    se: true,
    emoji: "galaxy",
  },
  "Captain Mannypants": {
    tokens: [560],
    description: "A legendary manny created by Neoboy.",
    se: true,
    emoji: "captainmannypants",
  },
};

const rolePicker = (ownedTokens) => {
  const roles = [];
  if (ownedTokens.length) {
    roles.push(roleMap["Gamer"]);
  }

  ownedTokens.forEach((token) => {
    const isBase = Object.keys(skinMap).every((skin) => {
      return skinMap[skin].tokens.every((tokenId) => tokenId !== token);
    });

    Object.keys(skinMap).forEach((skin) => {
      const { se, tokens } = skinMap[skin];
      if (tokens.some((tokenId) => tokenId === token)) {
        let role = skin;
        if (se) {
          if (tokens.length === 1) {
            role = "Legendary";
          } else {
            role = "Special Edition";
          }
        }
        if (!roles.includes(roleMap[role])) {
          roles.push(roleMap[role]);
        }
      }
    });

    if (token < 404 && isBase && !roles.includes(roleMap["Base Rare"])) {
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

  const result = await asyncForEach(addRoles, async (roleId) => {
    return fetch(
      `https://discord.com/api/guilds/${guildId}/members/${session.userId}/roles/${roleId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
  });

  const removeResult = await asyncForEach(removeRoles, async (roleId) => {
    return fetch(
      `https://discord.com/api/guilds/${guildId}/members/${session.userId}/roles/${roleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
  });

  const roleNames = newRoles.map((nr) =>
    Object.keys(roleMap).find((rm) => roleMap[rm] === nr)
  );

  res.send(JSON.stringify({ rolesEarned: roleNames, result }));
};
