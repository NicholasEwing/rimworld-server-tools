const fs = require("fs/promises");
const { exec } = require("child_process");

// SteamCMD can take a text file with a bunch of commands, so we'll make that here
async function writeSteamCommands(requiredMods, whitelistedMods) {
  const modCommands = [...requiredMods, ...whitelistedMods].map(
    (mod) => `workshop_download_item 294100 ${mod}`
  );

  const text = ["login anonymous", ...modCommands, "quit"].join("\n");

  await fs.writeFile("steam_commands.txt", text);
}

// TODO: Use spawn instead of exec for fancy progress bars
// delete steam_commands.txt at the end of the program

// Let's run SteamCMD with all our commands now
async function downloadAllMods(requiredMods, whitelistedMods) {
  await writeSteamCommands(requiredMods, whitelistedMods);
  console.log("Downloading the steam workshop!");

  exec(
    "steamcmd.exe +runscript steam_commands.txt",
    { cwd: "C:/steamcmd/" },
    (error, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    }
  );
}

module.exports = downloadAllMods;
