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
global.preloadPath = path.join(__dirname, 'preload.js');

const iconPath = utils.getIconPath();

mutex.createMutex();

function createMainWindow () {
  const win = new global.electron.BrowserWindow({
    show: false,
    title: app.getName(),
    x: config.store.get(config.names.x),
    y: config.store.get(config.names.y),
    width: config.store.get(config.names.width),
    height: config.store.get(config.names.height),
    titleBarStyle: 'hidden-inset',
    autoHideMenuBar: config.store.get(config.names.hideMenu),
    icon: iconPath,
    webPreferences: {
      enableRemoteModule: true,
      nativeWindowOpen: true,
      nodeIntegration: false,
      webSecurity: false,
      plugins: true,
      preload: preloadPath,
    }
  });
  win.loadURL('https://tweetdeck.twitter.com/');
  return win;
}

app.on('ready', function() {
  mainWindow = createMainWindow();

  // Main window events
  mainWindow.on('maximize', () => config.store.set(config.names.maximized, true));
  mainWindow.on('unmaximize', () => config.store.set(config.names.maximized, false));
  mainWindow.once('ready-to-show', () => {
    if (config.store.get(config.names.maximized)) {
      mainWindow.maximize();
    }
    mainWindow.show();
  });

  // Menu
  appMenu = menu.createMenu(menu.getMenuTemplate());
  menu.setMenuChecks(appMenu);

  // Tray
  appTray = tray.createTray(iconPath, tray.createMenu());
  mainWindow.on('minimize', (e) => utils.hideToTray('minimize', e));
  mainWindow.on('close', (e) => utils.hideToTray('close', e));

  // New Windows
  const page = mainWindow.webContents;
  page.on('new-window', utils.newWindow);

  // Handle 2FA
  page.on('did-get-redirect-request', utils.handleRedirections.bind(mainWindow));

  // Inject user CSS
  page.on('dom-ready', utils.loadUserCss);

  // Quit
  app.on('window-all-closed', utils.windowAllClosed);
  app.on('will-quit', utils.beforeQuit);
});

shared.watchExceptions();
