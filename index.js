global.electron = require('electron');
global.app = global.electron.app;

const package = require('./package.json');
const Configstore = require('configstore');
const path = require('path');
const utils = require('./utils');
const mutex = require('./mutex');
const tray = require('./tray');
const menu = require('./menu');

global.mainWindow = null;
global.appMenu = null;
global.config = new Configstore(package.name, { openBrowser: true });
global.preloadPath = path.join(__dirname, 'preload.js');

const iconPath = utils.getIconPath();

mutex.createMutex();

function createMainWindow () {
  const win = new global.electron.BrowserWindow({
    title: app.getName(),
    minWidth: 400,
    minHeight: 400,
    titleBarStyle: 'hidden-inset',
    icon: iconPath,
    webPreferences: {
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
  mainWindow.maximize();

  // Menu
  appMenu = menu.createMenu(menu.getMenuTemplate());
  appMenu.items[1].submenu.items[0].checked = config.get('openBrowser');

  // Tray
  var appTray = tray.createTray(iconPath, tray.createMenu());
  mainWindow.on('minimize', utils.hideToTray);

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
