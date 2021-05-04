global.electron = require('electron');
global.app = global.electron.app;

const path = require('path');
const utils = require('./utils');
const mutex = require('./mutex');
const tray = require('./tray');
const menu = require('./menu');
const shared = require('./shared');

global.mainWindow = null;
global.appMenu = null;
global.appTray = null;
global.config = require('./config');
global.preloadPath = path.join(__dirname, './preload.js');

const iconPath = utils.getIconPath();

mutex.createMutex();

function createMainWindow () {
  const win = new global.electron.BrowserWindow({
    show: false,
    title: global.app.getName(),
    x: global.config.store.get(global.config.names.x),
    y: global.config.store.get(global.config.names.y),
    width: global.config.store.get(global.config.names.width),
    height: global.config.store.get(global.config.names.height),
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: global.config.store.get(global.config.names.hideMenu),
    icon: iconPath,
    webPreferences: {
      enableRemoteModule: true,
      nativeWindowOpen: true,
      nodeIntegration: false,
      webSecurity: false,
      plugins: true,
      preload: global.preloadPath,
    }
  });
  win.loadURL('https://tweetdeck.twitter.com/');
  return win;
}

global.app.on('ready', function() {
  global.mainWindow = createMainWindow();

  // Main window events
  global.mainWindow.on('maximize', () => global.config.store.set(global.config.names.maximized, true));
  global.mainWindow.on('unmaximize', () => global.config.store.set(global.config.names.maximized, false));
  global.mainWindow.once('ready-to-show', () => {
    if (global.config.store.get(global.config.names.maximized)) {
      global.mainWindow.maximize();
    }
    global.mainWindow.show();
  });

  // Menu
  global.appMenu = menu.createMenu(menu.getMenuTemplate());
  menu.setMenuChecks(global.appMenu);

  // Tray
  global.appTray = tray.createTray(iconPath, tray.createMenu());
  global.mainWindow.on('minimize', (e) => utils.hideToTray('minimize', e));
  global.mainWindow.on('close', (e) => utils.hideToTray('close', e));

  // New Windows
  const page = global.mainWindow.webContents;
  page.on('new-window', shared.NewWindowEvent(global.mainWindow));

  // Inject user CSS
  page.on('dom-ready', utils.loadUserCss);

  // Quit
  global.app.on('window-all-closed', utils.windowAllClosed);
  global.app.on('will-quit', utils.beforeQuit);
});

shared.watchExceptions();
