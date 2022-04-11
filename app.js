const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const colors = require("ansi-colors");
const { MultiBar } = require("cli-progress");

const scrapeWorkshopCollection = require("./functions/scrapeWorkshopCollection");
const downloadAllMods = require("./functions/downloadAllMods");
const downloadNewMods = require("./functions/downloadNewMods");
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
const start = async () => {
  const requiredMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780083454"
  );
  const whitelistedMods = await scrapeWorkshopCollection(
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2780086503"
  );

  const downloadBars = new MultiBar({
    format: `{file} [${colors.cyan("{bar}")}] {percentage}% | {value}/{total}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    stopOnComplete: true,
    fps: 144,
  });

  // Define paths, xcopy needs backward slashes to work properly
  const requiredPath = "C:\\RimWorldServer\\Mods";
  const whitelistedPath = `C:\\RimWorldServer\\Whitelisted\ Mods`;

  if (process.argv.includes("update")) {
    await downloadNewMods(
      requiredMods,
      whitelistedMods,
      requiredPath,
      whitelistedPath,
      downloadBars
    );
  } else {
    await downloadAllMods(
      requiredMods,
      whitelistedMods,
      requiredPath,
      whitelistedPath,
      downloadBars
    );
  }

  downloadBars.stop();

  await focusRimWorldServer();

  setTimeout(() => {
    sendInputToServer("reload");
  }, 500);
};

start();
