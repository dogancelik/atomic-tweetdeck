exports.newWindow = function (e, url) {
  if (config.get('openBrowser')) {
    e.preventDefault();
    global.electron.shell.openExternal(url);
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
