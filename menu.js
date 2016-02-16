exports.getMenuTemplate = function () {
  return [{
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Ctrl+R',
        click() { mainWindow.reload(); }
      },
      {
        label: 'Hide',
        accelerator: 'Ctrl+W',
        role: 'minimize'
      },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click() { app.quit(); }
      }
    ]
  }];
};

exports.createMenu = function (template) {
  const Menu = GLOBAL.electron.Menu;
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  return menu;
};
