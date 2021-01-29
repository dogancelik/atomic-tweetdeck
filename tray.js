const Menu = global.electron.Menu;

function showWindow () {
  // restore() removes maximized state if window is not minimized but hidden
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
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
  let tray = new global.electron.Tray(iconPath);
  tray.setToolTip(global.app.getName());
  tray.setContextMenu(menu);
  tray.on('double-click', toggleWindow);
  return tray;
};
