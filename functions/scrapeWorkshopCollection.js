const puppeteer = require("puppeteer");

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

    return workshopIds;

    // Get mod names for each mod in the collection
    // const modNames = Array.from(
    //   document.querySelectorAll(".collectionItemDetails .workshopItemTitle")
    // ).map((item) =>
    //   item.textContent.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "")
    // );

    // format the workshop ID and mod name into the format [workshopId, modName] (ex: ['2009463077', 'Harmony'])
    // let formattedMods = [];
    // if (workshopIds.length === modNames.length) {
    //   formattedMods = workshopIds.map((item, i) => [item, modNames[i]]);
    //   return formattedMods;
    // } else {
    //   throw new Error(
    //     "The workshop links and mod names lists are not equal length. Please check the page / code logic."
    //   );
    // }
  });

  await browser.close();

  return mods;
}

module.exports = scrapeWorkshopCollection;
