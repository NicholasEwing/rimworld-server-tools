const fs = require("fs/promises");

module.exports = async function writeSteamCommands(mods) {
  const modCommands = [...mods].map(
    (mod) => `workshop_download_item 294100 ${mod}`
  );

  const text = ["login anonymous", ...modCommands, "quit"].join("\n");
  const steamFileName = `C:/steamcmd/steam_commands_${mods.length}.txt`;

  await fs.writeFile(steamFileName, text);
  return steamFileName;
};
