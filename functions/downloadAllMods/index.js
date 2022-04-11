const downloadModArray = require("./helpers/downloadModArray");

module.exports = async function downloadAllMods(
  requiredMods,
  whitelistedMods,
  requiredPath,
  whitelistedPath,
  downloadBars
) {
  // make progress bars
  const b1 = downloadBars.create(requiredMods.length, 0, {
    file: "Downloading Required Mods   ",
  });
  const b2 = downloadBars.create(whitelistedMods.length, 0, {
    file: "Downloading Whitelisted Mods",
  });

  const a = downloadModArray(requiredMods, whitelistedMods, b1, requiredPath);
  const b = downloadModArray(
    whitelistedMods,
    requiredMods,
    b2,
    whitelistedPath
  );
  const downloadedMods = await Promise.all([a, b]);

  return downloadedMods;
};
