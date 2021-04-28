export declare global {
    var electron: typeof import('electron');
    var app: Electron.App;
    var mainWindow: Electron.BrowserWindow;
    var appMenu: Electron.Menu;
    var appTray: Electron.Tray;
    var preloadPath: string;
    var config: typeof import('./lib/config');
}
