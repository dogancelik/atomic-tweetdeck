// Reference from https://github.com/yoshuawuyts/vmd/blob/master/shared/create-menu.js
const isRenderer = process.type === 'renderer';
const electron = require('electron');
const sharedElectron = isRenderer ? electron.remote : electron;
const Menu = sharedElectron.Menu;
const MenuItem = sharedElectron.MenuItem;
const BrowserWindow = sharedElectron.BrowserWindow;

function updateMenuItems(m, model, tplArr = [], p) {
  tplArr.forEach((tplItem) => {
    if (!tplItem.menuItem) {
      const menuItemOptions = {
        click: tplItem.click,
        role: tplItem.role,
        type: tplItem.type,
        label: tplItem.label,
        sublabel: tplItem.sublabel,
        accelerator: tplItem.accelerator,
        icon: tplItem.icon,
        id: tplItem.id,
        position: tplItem.position,
      };

      if (Array.isArray(tplItem.submenu)) {
        menuItemOptions.submenu = new Menu();
      }
      if (tplItem.click) {
        menuItemOptions.click = (item, win) => {
          tplItem.click(m.getModel(), item, win);
        };
      }

      // eslint-disable-next-line no-param-reassign
      tplItem.menuItem = new MenuItem(menuItemOptions);

      p.append(tplItem.menuItem);
    }

    if (typeof tplItem.visible === 'function') {
      // eslint-disable-next-line no-param-reassign
      tplItem.menuItem.visible = tplItem.visible(model, tplItem.menuItem);
    }

    if (typeof tplItem.enabled === 'function') {
      // eslint-disable-next-line no-param-reassign
      tplItem.menuItem.enabled = tplItem.enabled(model, tplItem.menuItem);
    }

    if (tplItem.menuItem.submenu) {
      updateMenuItems(m, model, tplItem.submenu, tplItem.menuItem.submenu);
    }
  });

  return p;
}

function createMenu(template, initialModel) {
  const menu = new Menu();
  let localModel = initialModel;

  const m = {
    getMenu() {
      return menu;
    },

    getModel() {
      return localModel;
    },

    update(newModel) {
      Object.assign(localModel, newModel);
      updateMenuItems(this, m.getModel(), template, m.getMenu());
    },
  };

  updateMenuItems(m, m.getModel(), template, m.getMenu());

  return m;
}

exports.CustomMenu = createMenu;

function watchExceptions() {
  console.log('Watching exceptions on process:', process.type);
  process.on('uncaughtException', function (err) {
    console.log('Uncaught Exception', err);
  });
}

exports.watchExceptions = watchExceptions;

class MyBrowserWindow extends BrowserWindow {
  constructor (opts) {
    super(Object.assign({
      webPreferences: {
        contextIsolation: true,
        enableRemoteModule: true,
        nativeWindowOpen: true,
        preload: global.preloadPath
      },
    }, opts));
  }
}

/**
 * @param {Electron.BrowserWindow} parentWindow
 * @returns {AtomicTweetdeck.NewWindowEventListener} New window event function
 */
function NewWindowEvent(parentWindow) {
  return function onNewWindow(e, url, frame, dis, opts) {
    if (config.store.get(config.names.openBrowser)) {
      e.preventDefault();
      sharedElectron.shell.openExternal(url);
    } else {
      e.preventDefault();
      const bounds = Object.assign({}, e.sender.browserWindowOptions);
      if (parentWindow) {
        let parentBounds = parentWindow.getNormalBounds();
        Object.assign(bounds, parentBounds);
      }

      const win = new MyBrowserWindow({
        show: false,
        parentWindow: parentWindow,
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
      });
      win.webContents.on('new-window', NewWindowEvent(win));
      if (parentWindow) {
        if (parentWindow.isMaximized()) {
          win.maximize();
        }
        if (parentWindow.isFullScreen()) {
          win.setFullScreen(true);
        }
      }
      win.once('ready-to-show', () => {
        win.show();
      });
      win.loadURL(url);
      e.newGuest = win;
    }
  };
}

exports.NewWindowEvent = NewWindowEvent;
