const fs = require("fs/promises");
const fsSync = require("fs");
const { spawn } = require("child_process");
const colors = require("ansi-colors");
const { MultiBar } = require("cli-progress");

module.exports = async function copyToServerFolders(
  serverPath,
  copyProgressBar,
  steamCmdRimWorldPath,
  xcopyIgnoreFile
) {
  return new Promise(async (resolve, reject) => {
    // copy the mods we downloaded from SteamCMD into the appropriate RimWorldServer folder
    // "/Mods" is for required mods, while "/Whitelisted Mods" is for optional mods
    const xcopyProcess = spawn("xcopy", [
      steamCmdRimWorldPath, //source
      `${serverPath}`, // dest
      `/Y/E/I/exclude:${xcopyIgnoreFile}`, // overwrite all, copy empty folders, create source dir if needed, and ignore certain folders
    ]);

    xcopyProcess.stdout.on("data", (data) => {
      if (data.toString().includes("steamcmd\\steamapps\\workshop\\content")) {
        copyProgressBar.increment();
      } else {
      }
    });

    xcopyProcess.on("error", (error) => {
      console.log(error.toString());
      copyProgressBar.stop();
      fsSync.unlink(xcopyIgnoreFile, (err) => {
        if (err) {
          console.log(err);
        }
      });
      reject();
    });

    xcopyProcess.on("exit", () => {
      copyProgressBar.stop();
      fsSync.unlink(xcopyIgnoreFile, (err) => {
        if (err) {
          console.log(err);
        }
      });
      resolve();
    });
  });
};
