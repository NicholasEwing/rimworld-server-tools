const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

// Adds support for pkg so we can turn this bad boy in an executable
const isPkg = typeof process.pkg !== "undefined";

//mac path replace
let chromiumExecutablePath = isPkg
  ? puppeteer
      .executablePath()
      .replace(
        /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
        path.join(path.dirname(process.execPath), "chromium")
      )
  : puppeteer.executablePath();

//check win32
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

async function scrapeWorkshopCollection(url) {
  const browser = await puppeteer.launch({
    executablePath: chromiumExecutablePath,
  });
  const page = await browser.newPage();
  await page.goto(url);

  const mods = await page.evaluate(() => {
    // Get steam workshop ids for each mod in the collection
    const workshopIds = Array.from(
      document.querySelectorAll(".collectionItemDetails > a")
    ).map((item) => {
      const link = item.href;
      return link.substring(link.indexOf("id") + 3);
    });

    // Get mod names for each mod in the collection
    const modNames = Array.from(
      document.querySelectorAll(".collectionItemDetails .workshopItemTitle")
    ).map((item) =>
      item.textContent.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "")
    );

    console.log(modNames);

    // format the workshop ID and mod name into the format [workshopId, modName] (ex: ['2009463077', 'Harmony'])
    let formattedMods = [];
    if (workshopIds.length === modNames.length) {
      formattedMods = workshopIds.map((item, i) => [item, modNames[i]]);
      return formattedMods;
    } else {
      throw new Error(
        "The workshop links and mod names lists are not equal length. Please check the page / code logic."
      );
    }
  });

  await browser.close();

  return mods;
}

const start = async () => {
  console.log("Downloading mods...");
  const requiredMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780083454"
  );
  const optionalMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780086503"
  );

  await fs.writeFile("RequiredModlist.txt", requiredMods.join("\r\n"));
  await fs.writeFile("OptionalModlist.txt", optionalMods.join("\r\n"));
};

start();
