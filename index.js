GLOBAL.electron = require('electron');
GLOBAL.app = GLOBAL.electron.app;

const utils = require('./utils');
const mutex = require('./mutex');
const tray = require('./tray');
const menu = require('./menu');

GLOBAL.mainWindow = null;

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
      plugins: true
    }
  });
  win.loadURL('https://tweetdeck.twitter.com/');
	win.maximize();
  return win;
}

app.on('ready', function() {
  mainWindow = createMainWindow();

  // Menu
  var appMenu = menu.createMenu(menu.getMenuTemplate());

  // Tray
  var appTray = tray.createTray(iconPath, appMenu.items[0].submenu);
  mainWindow.on('minimize', utils.hideToTray);

  // New Windows
  const page = mainWindow.webContents;
  page.on('new-window', utils.newWindow);

  // Quit
  app.on('window-all-closed', utils.windowAllClosed);
  app.on('will-quit', utils.beforeQuit);
});
