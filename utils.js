const path = require('path');
const fs = require('fs');

exports.newWindow = function (e, url, frame, dis, opts) {
  if (config.get('openBrowser')) {
    e.preventDefault();
    global.electron.shell.openExternal(url);
  } else {
    let size = global.mainWindow.getSize();
    opts.parent = global.mainWindow;
    opts.width = size[0];
    opts.height = size[1];
  }
};

exports.windowAllClosed = function () {
  app.quit();
};

exports.hideToTray = function () {
  mainWindow.hide();
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
