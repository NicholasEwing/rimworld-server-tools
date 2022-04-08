const { keyboard, Key } = require("@nut-tree/nut-js");

// simulates typing a command and smacking "enter" on your keyboard
module.exports = async function sendInputToServer(command) {
  keyboard.config.autoDelayMs = 0;
  await keyboard.type(command);
  await keyboard.type(Key.Return);
};
