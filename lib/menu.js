const URL_WEBSITE = 'https://dogancelik.com/atomic-tweetdeck/';
const URL_ISSUES = 'https://github.com/dogancelik/atomic-tweetdeck/issues';

const appName = global.electron.app.getName();
const appVersion = global.electron.app.getVersion();

const shell = global.electron.shell;
const dialog = global.electron.dialog;

const { getAboutMessage, updateState } = require('./utils');

exports.getMenuTemplate = function () {
  return [{
    label: '&Window',
    role: 'window',
    submenu: [
      {
        visible: false,
        label: 'Toggle &DevTools',
        accelerator: 'F12',
        click(item, wnd) { wnd.webContents.toggleDevTools(); }
      },
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
        click() {
          // app.exit() crashes Electron on child window
          // can't do app.quit() if Close to Tray
          // this will work because windowAllClosed
          updateState();
          Array.prototype.slice.call(global.electron.BrowserWindow.getAllWindows())
            .forEach((wnd) => wnd.destroy());
        }
      }
    ]
  }, {
    label: '&View',
    role: 'view',
    submenu: [
      {
        label: 'Zoom &In',
        accelerator: 'CmdOrCtrl+NumAdd',
        click(item, wnd) { wnd.webContents.setZoomLevel(wnd.webContents.getZoomLevel() + 1); }
      },
      {
        label: 'Zoom &Out',
        accelerator: 'CmdOrCtrl+NumSub',
        click(item, wnd) { wnd.webContents.setZoomLevel(wnd.webContents.getZoomLevel() - 1); }
      },
      {
        label: '&Reset Zoom',
        accelerator: 'CmdOrCtrl+Num0',
        click(item, wnd) { wnd.webContents.setZoomLevel(0); }
      },
    ]
  }, {
    label: '&History',
    submenu: [
      {
        label: 'Go &Back',
        accelerator: 'Alt+Left',
        click(item, wnd) { wnd.webContents.canGoBack() && wnd.webContents.goBack(); }
      },
      {
        label: 'Go &Forward',
        accelerator: 'Alt+Right', // Insert smug Pepe here
        click(item, wnd) { wnd.webContents.canGoForward() && wnd.webContents.goForward(); }
      }
    ]
  }, {
    label: '&Settings',
    submenu: [
      {
        id: config.names.openBrowser,
        label: 'Open new windows in default browser',
        type: 'checkbox',
        click() { config.store.set(config.names.openBrowser, !config.store.get(config.names.openBrowser)); }
      },
      {
        id: config.names.minToTray,
        label: 'Minimize to Tray',
        type: 'checkbox',
        click() { config.store.set(config.names.minToTray, !config.store.get(config.names.minToTray)); }
      },
      {
        id: config.names.hideMenu,
        label: 'Hide menu',
        type: 'checkbox',
        click(item, wnd) {
          let newValue = !config.store.get(config.names.hideMenu);
          wnd.setAutoHideMenuBar(newValue);
          wnd.setMenuBarVisibility(!newValue);
          config.store.set(config.names.hideMenu, newValue);
        }
      }
    ]
  }, {
    label: 'Hel&p',
    submenu: [
      {
        label: '&Visit Website',
        click() { shell.openExternal(URL_WEBSITE); }
      },
      {
        label: '&Report Issue',
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
  appMenu.getMenuItemById(config.names.openBrowser).checked = config.store.get(config.names.openBrowser);
  appMenu.getMenuItemById(config.names.minToTray).checked = config.store.get(config.names.minToTray);
  appMenu.getMenuItemById(config.names.hideMenu).checked = config.store.get(config.names.hideMenu);
};
