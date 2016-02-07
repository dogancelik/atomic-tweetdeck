exports.newWindow = function (e, url) {
  e.preventDefault();
  GLOBAL.electron.shell.openExternal(url);
};

exports.windowAllClosed = function () {
  app.quit();
};

exports.hideToTray = function () {
  mainWindow.hide();
};

exports.beforeQuit = function () {
  GLOBAL.electron.globalShortcut.unregisterAll();
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
}
