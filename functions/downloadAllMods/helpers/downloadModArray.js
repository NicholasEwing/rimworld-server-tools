const fsSync = require("fs");
const fs = require("fs/promises");
const { spawn } = require("child_process");
const writeSteamCommands = require("./writeSteamCommands");
const copyToServerFolders = require("./copyToServerFolders");

module.exports = async function downloadModArray(
  modsToInstall,
  modsToIgnore,
  progressBar,
  serverPath
) {
  const steamFileName = await writeSteamCommands(modsToInstall);

  const steamCmd = spawn(
    "steamcmd.exe",
    ["+runscript", `steam_commands_${modsToInstall.length}.txt`],
    {
      cwd: "C:/steamcmd",
    }
  );

  // If we download a mod successfully, increment the bar
  steamCmd.stdout.on("data", (data) => {
    if (data.toString().includes("Success. Downloaded item")) {
      progressBar.increment();
    }
  });

  // If we get any of these events, delete the txt file we made
  steamCmd.on("error", (error) => {
    console.log(error.toString());
    progressBar.stop();
    fsSync.unlink(steamFileName, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  steamCmd.on("exit", () => {
    progressBar.stop();
    fsSync.unlink(steamFileName, (err) => {
      if (err) {
        console.log(err);
      }
    });
    copyToServerFolders(serverPath, modsToInstall, modsToIgnore);
  });
};
