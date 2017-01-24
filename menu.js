const URL_WEBSITE = 'https://dogancelik.com/atomic-tweetdeck/';
const URL_ISSUES = 'https://github.com/dogancelik/atomic-tweetdeck/issues';

const appName = global.electron.app.getName();
const appVersion = global.electron.app.getVersion();

const shell = global.electron.shell;
const dialog = global.electron.dialog;

const { getAboutMessage } = require('./utils');

exports.getMenuTemplate = function () {
  return [{
    label: '&Window',
    role: 'window',
    submenu: [
      {
        label: '&Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, wnd) { wnd.reload(); }
      },
      {
        label: '&Hide',
        accelerator: 'CmdOrCtrl+W',
        click(item, wnd) {
          if (wnd.getParentWindow() == null) {
            wnd.minimize();
          } else {
            wnd.close();
          }
        }
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
          dialog.showMessageBox(global.mainWindow, {
            buttons: ['OK'],
            title: 'About ' + appName,
            message: getAboutMessage(appName, appVersion)
          })
        }
      }
    ]
  }];
};

exports.createMenu = function (template) {
  const Menu = global.electron.Menu;
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  return menu;
};
