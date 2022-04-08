const fs = require("fs/promises");
const fsSync = require("fs");
const { spawn } = require("child_process");
const colors = require("ansi-colors");
const { MultiBar } = require("cli-progress");
const countFilesInModPath = require("./countFilesInModPath");

module.exports = async function copyToServerFolders(
  serverPath,
  modsToInstall,
  modsToIgnore
) {
  // xcopy needs backward slashes to work for both of these paths
  const steamCmdRimWorldPath = `C:\\steamcmd\\steamapps\\workshop\\content\\294100`;
  const xcopyIgnoreFile = `C:\\RimWorldServer\\excludes-${modsToIgnore.length}.txt`;

  const numberOfFiles = await countFilesInModPath(
    steamCmdRimWorldPath,
    modsToInstall
  );

  // create multibar for required mods
  const multibarNew = new MultiBar({
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

  const progressBar = multibarNew.create(numberOfFiles, 0, {
    file: progressBarText,
  });

  // create ignore file for xcopy
  await fs.writeFile(xcopyIgnoreFile, modsToIgnore.join("\n"));

  // copy the mods we downloaded from SteamCMD into the appropriate RimWorldServer folder
  // "/Mods" is for required mods, while "/Whitelisted Mods" is for optional mods
  const xcopyProcess = spawn("xcopy", [
    steamCmdRimWorldPath, //source
    `${serverPath}`, // dest
    `/Y/E/I/exclude:${xcopyIgnoreFile}`, // overwrite all, copy empty folders, create source dir if needed, and ignore certain folders
  ]);

  xcopyProcess.stdout.on("data", (data) => {
    if (data.toString().includes("steamcmd")) {
      progressBar.increment();
    }
  });

  xcopyProcess.on("error", (error) => {
    console.log(error.toString());
    fsSync.unlink(xcopyIgnoreFile, (err) => {
      progressBar.stop();

      if (err) {
        console.log(err);
      }
    });
  });

  xcopyProcess.on("close", () => {
    progressBar.stop();
  });

  xcopyProcess.on("exit", () => {
    fsSync.unlink(xcopyIgnoreFile, (err) => {
      progressBar.stop();
      if (err) {
        console.log(err);
      }
    });
  });
};
