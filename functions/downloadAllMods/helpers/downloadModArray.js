const fs = require("fs/promises");
const fsSync = require("fs");
const { spawn } = require("child_process");
const colors = require("ansi-colors");
const { MultiBar } = require("cli-progress");

const writeSteamCommands = require("./writeSteamCommands");
const copyToServerFolders = require("./copyToServerFolders");
const countFilesInModPath = require("./countFilesInModPath");

module.exports = function downloadModArray(
  modsToInstall,
  modsToIgnore,
  progressBar,
  serverPath
) {
  return new Promise(async (resolve, reject) => {
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
      fsSync.unlink(steamFileName, (err) => {
        if (err) {
          console.log(err);
        }
        reject();
      });
    });

    steamCmd.on("close", async () => {
      progressBar.stop();
      fsSync.unlink(steamFileName, (err) => {
        if (err) {
          console.log(err);
        }
      });
      // xcopy needs backward slashes to work for both of these paths
      const steamCmdRimWorldPath = `C:\\steamcmd\\steamapps\\workshop\\content\\294100`;
      const xcopyIgnoreFile = `C:\\RimWorldServer\\excludes-${modsToIgnore.length}.txt`;

      // create ignore file for xcopy
      await fs.writeFile(xcopyIgnoreFile, modsToIgnore.join("\n"));

      // TODO: Count # of files differently when updating vs downloading all
      const numberOfFiles = await countFilesInModPath(
        steamCmdRimWorldPath,
        modsToInstall
      );

      // create multibar for required mods
      const copyProgressBars = new MultiBar({
        format: `Moving {file} Into RimWorld Server [${colors.yellow(
          "{bar}"
        )}] {percentage}% | {value}/{total} |`,
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
        stopOnComplete: true,
        fps: 144,
      });

      let progressBarText;
      if (serverPath.includes("Whitelisted")) {
        progressBarText = "Whitelisted Mods";
      } else {
        progressBarText = "Required Mods";
      }

      const copyProgressBar = copyProgressBars.create(numberOfFiles, 0, {
        file: progressBarText,
      });

      await copyToServerFolders(
        serverPath,
        copyProgressBar,
        steamCmdRimWorldPath,
        xcopyIgnoreFile
      );
      copyProgressBars.stop();
      resolve();
    });
  });
};
