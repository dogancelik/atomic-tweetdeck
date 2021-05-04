export declare global {
    namespace NodeJS {
        interface Global {
            electron: typeof import('electron');
            app: Electron.App;
            mainWindow: Electron.BrowserWindow;
            appMenu: Electron.Menu;
            appTray: Electron.Tray;
            preloadPath: string;
            config: AtomicTweetdeck.Config;
        }
    }
}
