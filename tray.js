const Menu = GLOBAL.electron.Menu;

function showWindow () {
  mainWindow.restore();
  mainWindow.show();
}

function hideWindow() {
  mainWindow.minimize();
}

exports.createMenu = function () {
  var template = [{
    label: '&Toggle',
    click() {
      if (mainWindow.isVisible()) {
        hideWindow();
      } else {
        showWindow();
      }
    }
  }, {
    label: '&Reload',
    click() {
      mainWindow.reload();
    }
  }, {
    label: '&Quit',
    click() { app.quit(); }
  }];

  return Menu.buildFromTemplate(template);
}

exports.createTray = function (iconPath, menu) {
  var tray = new GLOBAL.electron.Tray(iconPath);
  tray.setToolTip('TweetDeck');
  tray.setContextMenu(menu);
  tray.on('double-click', showWindow);
  return tray;
};
