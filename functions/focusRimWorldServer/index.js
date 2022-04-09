const processWindows = require("node-process-windows");

module.exports = async function focusRimWorldServer() {
  //   const activeProcesses = processWindows.getProcesses(function (
  //     err,
  //     processes
  //   ) {
  //     processes.forEach(function (p) {
  //       console.log("PID: " + p.pid.toString());
  //       console.log("MainWindowTitle: " + p.mainWindowTitle);
  //       console.log("ProcessName: " + p.processName);
  //     });
  //   });
  processWindows.focusWindow("Open World");
  console.log("Focus RimWorld Server ran!");
  return;
};
