GLOBAL.electron = require('electron');
GLOBAL.app = GLOBAL.electron.app;

const package = require('./package.json');
const Configstore = require('configstore');
const path = require('path');
const utils = require('./utils');
const mutex = require('./mutex');
const tray = require('./tray');
const menu = require('./menu');

GLOBAL.mainWindow = null;
GLOBAL.appMenu = null;
GLOBAL.config = new Configstore(package.name, { openBrowser: true });

const iconPath = utils.getIconPath();

mutex.createMutex();

function createMainWindow () {
  const win = new GLOBAL.electron.BrowserWindow({
    title: app.getName(),
    minWidth: 400,
    minHeight: 400,
    titleBarStyle: 'hidden-inset',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      plugins: true,
      preload: path.join(__dirname, 'preload.js')
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
