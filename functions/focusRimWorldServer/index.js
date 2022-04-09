const processWindows = require("node-process-windows");

module.exports = async function focusRimWorldServer() {
  let activeWindow;
  const activeProcesses = processWindows.getProcesses(function (
    err,
    processes
  ) {
    let openWorldProcesses = processes.filter(
      (p) => p.processName.indexOf("Open World") >= 0
    );

    if (openWorldProcesses.length > 0) {
      processWindows.focusWindow(openWorldProcesses[0]);
      console.log("Focused RimWorld Server!");
      return;
    } else {
      throw new Error(
        "RimWorld server is not running! Instead of rerunning this script, please go launch your Open World server and use the 'reload' command."
      );
    }
  });

  return;
};
