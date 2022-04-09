const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const scrapeWorkshopCollection = require("./functions/scrapeWorkshopCollection");
const downloadAllMods = require("./functions/downloadAllMods");
const focusRimWorldServer = require("./functions/focusRimWorldServer");
const sendInputToServer = require("./functions/sendInputToServer");

// Adds support for pkg so we can turn this bad boy in an executable
const isPkg = typeof process.pkg !== "undefined";

if (process.platform == "win32") {
  chromiumExecutablePath = isPkg
    ? puppeteer
        .executablePath()
        .replace(
          /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
          path.join(path.dirname(process.execPath), "chromium")
        )
    : puppeteer.executablePath();
}

// where the magic happens
// TODO: Use fancy load indicators while web scraping
const start = async () => {
  const requiredMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780083454"
  );
  const whitelistedMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780086503"
  );

  // const [requiredMods, whitelistedMods] = await Promise.all([
  //   required,
  //   whitelisted,
  // ]);

  console.log("do we have these values??");
  console.log(requiredMods.length);
  console.log(whitelistedMods.length);

  await downloadAllMods(requiredMods, whitelistedMods);

  focusRimWorldServer();

  setTimeout(() => {
    console.log("reloading!");
    sendInputToServer("reload");
  }, 500);
};

start();
