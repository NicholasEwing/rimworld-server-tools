const fsSync = require("fs");

module.exports = function getAllFiles(dirPath, arrayOfFiles) {
  files = fsSync.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fsSync.statSync(`${dirPath}\\${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}\\${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(`${dirPath}\\${file}`);
    }
  });

  return arrayOfFiles;
};
