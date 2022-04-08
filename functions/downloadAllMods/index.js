const colors = require("ansi-colors");
const { MultiBar } = require("cli-progress");

const downloadModArray = require("./helpers/downloadModArray");

module.exports = function downloadAllMods(requiredMods, whitelistedMods) {
  // Make our progress bars
  const multibar = new MultiBar({
    format: `Downloading {file} [${colors.cyan(
      "{bar}"
    )}] {percentage}% | {value}/{total}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    stopOnComplete: true,
    fps: 144,
  });

  const b1 = multibar.create(requiredMods.length, 0, {
    file: "Required Mods   ",
  });
  const b2 = multibar.create(whitelistedMods.length, 0, {
    file: "Whitelisted Mods",
  });

  // Defin paths, xcopy needs backward slashes to work properly
  const requiredPath = "C:\\RimWorldServer\\Mods";
  const whitelistedPath = `C:\\RimWorldServer\\Whitelisted\ Mods`;

  downloadModArray(requiredMods, whitelistedMods, b1, requiredPath);
  downloadModArray(whitelistedMods, requiredMods, b2, whitelistedPath);
};
