const Menu = global.electron.Menu;

function showWindow () {
  // restore() removes maximized state if window is not minimized but hidden
  if (global.mainWindow.isMinimized()) {
    global.mainWindow.restore();
  }
  global.mainWindow.show();
}

function hideWindow () {
  global.mainWindow.minimize();
}

function toggleWindow () {
	let isVisible = global.mainWindow.isVisible(),
		isMinimized = global.mainWindow.isMinimized();

  if (isVisible && !isMinimized) {
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
    click() { global.mainWindow.reload(); }
  }, {
    label: '&Quit',
    click() { global.appMenu.getMenuItemById('quit').click(); }
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
