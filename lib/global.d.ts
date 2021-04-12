import * as electron from 'electron';

declare global {
    var electron = require('electron');
    var app: electron.App;
    var mainWindow: electron.BrowserWindow;
    var appMenu: electron.Menu;
    var appTray: electron.Tray;
}
