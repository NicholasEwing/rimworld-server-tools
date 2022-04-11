const fs = require("fs/promises");

// these stack overflow snippets have the WORST syntax lmao
const getDirectories = async (source) =>
  (await fs.readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

module.exports = getDirectories;
