const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const scrapeWorkshopCollection = require("./functions/scrapeWorkshopCollection");
const downloadAllMods = require("./functions/downloadAllMods");

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
  console.log("Scraping workshop collections...");
  const requiredMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780083454"
  );
  const whitelistedMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780086503"
  );

  downloadAllMods(requiredMods, whitelistedMods);

  // await fs.writeFile("RequiredModlist.txt", requiredMods.join("\r\n"));
  // await fs.writeFile("OptionalModlist.txt", optionalMods.join("\r\n"));
};

start();
