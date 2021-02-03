const path = require('path');
const fs = require('fs');

class MyBrowserWindow extends global.electron.BrowserWindow {
  constructor (opts) {
    let size = global.mainWindow.getSize();
    super(Object.assign({
      width: size[0],
      height: size[1],
      webPreferences: {
        enableRemoteModule: true,
        nativeWindowOpen: true,
        preload: global.preloadPath
      },
    }, opts));
  }
}

exports.newWindow = function (e, url, frame, dis, opts) {
  if (config.store.get(config.names.openBrowser)) {
    e.preventDefault();
    global.electron.shell.openExternal(url);
  } else {
    e['newGuest'] = new MyBrowserWindow();
    e['newGuest'].webContents.on('new-window', exports.newWindow);
    e['newGuest'].loadURL(url);
    e.preventDefault();
  }
};

exports.windowAllClosed = function () {
  app.quit();
};

exports.hideToTray = function (action, event) {
  if (action == 'minimize' && config.store.get(config.names.minToTray)) {
    event.sender.hide();
  }

  if (action == 'close' && !config.store.get(config.names.minToTray)) {
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
  return __dirname + '/favicon' + iconExt;
};

exports.handleRedirections = function () {
  // Related: https://github.com/electron/electron/issues/3471#issuecomment-236368409
  if (arguments[3]) {
    setTimeout(()=>this.loadURL(arguments[2]), 100);
    arguments[0].preventDefault();
  }
};

exports.loadUserCss = function () {
  var filePath = path.join(__dirname, './user.css');
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
      const winBounds = mainWindow.getNormalBounds();
      config.store.set(config.names.x, winBounds.x);
      config.store.set(config.names.y, winBounds.y);
      config.store.set(config.names.width, winBounds.width);
      config.store.set(config.names.height, winBounds.height);
    } catch (err) {}
}
