const Menu = global.electron.Menu;

function showWindow () {
  mainWindow.restore();
  mainWindow.show();
}

function hideWindow () {
  mainWindow.minimize();
}

function toggleWindow () {
  if (mainWindow.isVisible()) {
    hideWindow();
  } else {
    showWindow();
  }
}

exports.createMenu = function () {
  var template = [{
    label: '&Toggle',
    click() { toggleWindow(); }
  }, {
    label: '&Reload',
    click() { mainWindow.reload(); }
  }, {
    label: '&Quit',
    click() { app.quit(); }
  }];

  return Menu.buildFromTemplate(template);
}

exports.createTray = function (iconPath, menu) {
  var tray = new global.electron.Tray(iconPath);
  tray.setToolTip(global.app.getName());
  tray.setContextMenu(menu);
  tray.on('double-click', toggleWindow);
  return tray;
};
