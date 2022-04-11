const getDirectories = require("./helpers/getDirectories");
const downloadModArray = require("../downloadAllMods/helpers/downloadModArray");

module.exports = async function downloadNewMods(
  requiredMods,
  whitelistedMods,
  requiredPath,
  whitelistedPath,
  downloadBars
) {
  // find what mods are already downloaded
  const downloadedRequiredMods = await getDirectories(requiredPath);
  const downloadedWhitelistedMods = await getDirectories(whitelistedPath);

  // find what mods are NOT downloaded
  const requiredModsToDownload = requiredMods.filter(
    (mod) => !downloadedRequiredMods.includes(mod)
  );
  const whitelistedModsToDownload = whitelistedMods.filter(
    (mod) => !downloadedWhitelistedMods.includes(mod)
  );

  // make progress bars
  const b1 = downloadBars.create(requiredModsToDownload.length, 0, {
    file: "Updating Required Mods   ",
  });
  const b2 = downloadBars.create(whitelistedModsToDownload.length, 0, {
    file: "Updating Whitelisted Mods",
  });

  try {
    // download required mods, ignore whitelisted mods when copying
    await downloadModArray(
      requiredModsToDownload,
      whitelistedMods,
      b1,
      requiredPath
    );

    // download whitelisted mods, ignore required mods when copying
    await downloadModArray(
      whitelistedModsToDownload,
      requiredMods,
      b2,
      whitelistedPath
    );

    return;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to download mods!");
  }
};
