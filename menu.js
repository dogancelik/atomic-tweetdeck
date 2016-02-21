const URL_WEBSITE = 'https://dogancelik.com/atomic-tweetdeck/';
const URL_ISSUES = 'https://github.com/dogancelik/atomic-tweetdeck/issues';

const appName = GLOBAL.electron.app.getName();
const appVersion = GLOBAL.electron.app.getVersion();

const shell = GLOBAL.electron.shell;
const dialog = GLOBAL.electron.dialog;

exports.getMenuTemplate = function () {
  return [{
    label: '&Window',
    role: 'window',
    submenu: [
      {
        label: '&Reload',
        accelerator: 'CmdOrCtrl+R',
        click() { mainWindow.reload(); }
      },
      {
        label: '&Hide',
        accelerator: 'CmdOrCtrl+W',
        role: 'minimize'
      },
      {
        label: '&Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() { app.quit(); }
      }
    ]
  }, {
    label: 'Settings',
    submenu: [
      {
        label: 'Open new windows in default browser',
        type: 'checkbox',
        click() { config.set('openBrowser', !config.get('openBrowser')); }
      }
    ]
  }, {
    label: '&Help',
    submenu: [
      {
        label: '&Visit website',
        click() { shell.openExternal(URL_WEBSITE); }
      },
      {
        label: '&Report an issue',
        click() { shell.openExternal(URL_ISSUES); }
      },
      {
        label: '&About ' + appName,
        click() {
          dialog.showMessageBox(GLOBAL.mainWindow, {
            buttons: ['OK'],
            title: 'About ' + appName,
            message: appName + ' v' + appVersion
          })
        }
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
