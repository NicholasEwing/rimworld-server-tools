const getAllFiles = require("./getAllFiles");

module.exports = async function countFilesInModPath(
  steamCmdRimWorldPath,
  modsToInstall
) {
  let numberOfFiles = 0;

  for (const mod of modsToInstall) {
    const modPath = `${steamCmdRimWorldPath}\\${mod}`;
    let result = getAllFiles(`${modPath}`);
    numberOfFiles += result.length;
  }

  return numberOfFiles;
};
