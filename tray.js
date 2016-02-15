function showWindow () {
  mainWindow.focus();
}

exports.createTray = function (iconPath, menu) {
  var tray = new GLOBAL.electron.Tray(iconPath);
  tray.setToolTip('TweetDeck');
  tray.setContextMenu(menu);
  tray.on('double-click', showWindow);
  return tray;
};
