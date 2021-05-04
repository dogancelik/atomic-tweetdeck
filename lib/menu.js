const URL_WEBSITE = 'https://dogancelik.com/atomic-tweetdeck/';
const URL_ISSUES = 'https://github.com/dogancelik/atomic-tweetdeck/issues';

const appName = global.electron.app.getName();
const appVersion = global.electron.app.getVersion();

const shell = global.electron.shell;
const dialog = global.electron.dialog;

const { getAboutMessage, updateState } = require('./utils');

/**
 * @returns {AtomicTweetdeck.MenuTemplate}
 */
exports.getMenuTemplate = function () {
  return [{
    label: '&Window',
    role: 'window',
    submenu: [
      {
        label: 'Copy &Page Address',
        click(item, wnd) { global.electron.clipboard.writeText(wnd.webContents.getURL()) }
      },
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
        id: 'quit',
        label: '&Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          // app.exit() crashes Electron on child window
          // can't do app.quit() if Close to Tray
          // this will work because windowAllClosed
          updateState();
          global.electron.BrowserWindow.getAllWindows()
            .forEach((wnd) => wnd.destroy());
        }
      }
    ]
  }, {
    label: '&View',
    submenu: [
      {
        label: 'Zoom &In',
        accelerator: 'CmdOrCtrl+NumAdd',
        role: 'zoomIn'
      },
      {
        label: 'Zoom &Out',
        accelerator: 'CmdOrCtrl+NumSub',
        role: 'zoomOut'
      },
      {
        label: '&Reset Zoom',
        accelerator: 'CmdOrCtrl+Num0',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen',
        accelerator: 'F11'
      }
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
        accelerator: 'Alt+Right',
        click(item, wnd) { wnd.webContents.canGoForward() && wnd.webContents.goForward(); }
      }
    ]
  }, {
    label: '&Settings',
    submenu: [
      {
        id: global.config.names.openBrowser,
        label: 'Open new windows in default browser',
        type: 'checkbox',
        click() { global.config.store.set(global.config.names.openBrowser, !global.config.store.get(global.config.names.openBrowser)); }
      },
      {
        id: global.config.names.minToTray,
        label: 'Minimize to Tray',
        type: 'checkbox',
        click() { global.config.store.set(global.config.names.minToTray, !global.config.store.get(global.config.names.minToTray)); }
      },
      {
        id: global.config.names.hideMenu,
        label: 'Hide menu',
        type: 'checkbox',
        click(item, wnd) {
          let newValue = !global.config.store.get(global.config.names.hideMenu);
          wnd.setAutoHideMenuBar(newValue);
          wnd.setMenuBarVisibility(!newValue);
          global.config.store.set(global.config.names.hideMenu, newValue);
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
  appMenu.getMenuItemById(global.config.names.openBrowser).checked = global.config.store.get(global.config.names.openBrowser);
  appMenu.getMenuItemById(global.config.names.minToTray).checked = global.config.store.get(global.config.names.minToTray);
  appMenu.getMenuItemById(global.config.names.hideMenu).checked = global.config.store.get(global.config.names.hideMenu);
};
