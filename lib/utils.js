const path = require('path');
const fs = require('fs');

exports.windowAllClosed = function () {
  global.app.quit();
};

exports.hideToTray = function (action, event) {
  if (action == 'minimize' && global.config.store.get(global.config.names.minToTray)) {
    event.sender.hide();
  }

  if (action == 'close' && !global.config.store.get(global.config.names.minToTray)) {
    event.sender.hide();
    event.preventDefault();
  }
};

exports.beforeQuit = function () {
  global.electron.globalShortcut.unregisterAll();
};

exports.getIconPath = function () {
  var iconExt = null;
  switch (process.platform) {
    case 'darwin':
      iconExt = '.icns';
      break;
    case 'linux':
      iconExt = '.png';
      break;
    case 'win32':
    default:
      iconExt = '.ico';
      break;

  }
  return path.join(__dirname, '../res/favicon' + iconExt);
};

exports.handleRedirections = function () {
  // Related: https://github.com/electron/electron/issues/3471#issuecomment-236368409
  if (arguments[3]) {
    setTimeout(()=>this.loadURL(arguments[2]), 100);
    arguments[0].preventDefault();
  }
};

exports.loadUserCss = function () {
  var filePath = path.join(__dirname, '../user.css');
  fs.readFile(filePath, (err, data) => !err && this.insertCSS(data.toString()));
};

exports.getAboutMessage = function (appName, appVersion) {
  let { electron, chrome } = process.versions;
  return appName + ' version: ' + appVersion + '\n' +
    'Electron version: ' + electron + '\n' +
    'Chrome version: ' + chrome;
};

exports.updateState = function () {
    // Don't throw an error when window was closed
    try {
      const winBounds = global.mainWindow.getNormalBounds();
      global.config.store.set(global.config.names.x, winBounds.x);
      global.config.store.set(global.config.names.y, winBounds.y);
      global.config.store.set(global.config.names.width, winBounds.width);
      global.config.store.set(global.config.names.height, winBounds.height);
    } catch (err) {
      //
    }
}
