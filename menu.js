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
        click() { global.app.exit(); }
      }
    ]
  }, {
    label: 'Hi&story',
    submenu: [
      {
        label: 'Go back',
        accelerator: 'Alt+Left',
        click(item, wnd) { wnd.webContents.canGoBack() && wnd.webContents.goBack(); }
      },
      {
        label: 'Go forward',
        accelerator: 'Alt+Right', // Insert smug Pepe here
        click(item, wnd) { wnd.webContents.canGoForward() && wnd.webContents.goForward(); }
      }
    ]
  }, {
    label: 'Settings',
    submenu: [
      {
        label: 'Open new windows in default browser',
        type: 'checkbox',
        click() { config.store.set(config.names.openBrowser, !config.store.get(config.names.openBrowser)); }
      },
      {
        label: 'Minimize to Tray',
        type: 'checkbox',
        click() { config.store.set(config.names.minToTray, !config.store.get(config.names.minToTray)); }
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

exports.setMenuChecks = function (appMenu) {
  appMenu.items[2].submenu.items[0].checked = config.store.get(config.names.openBrowser);
  appMenu.items[2].submenu.items[1].checked = config.store.get(config.names.minToTray);
};
