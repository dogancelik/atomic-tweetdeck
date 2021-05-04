declare namespace AtomicTweetdeck {
	type MenuTemplate = Array<(Electron.MenuItemConstructorOptions)>;

	class BrowserWindowUndoc extends Electron.BrowserWindow {
		browserWindowOptions: Electron.BrowserWindowConstructorOptions
	}

	interface NewWindowExtendedEvent extends Electron.NewWindowWebContentsEvent {
		sender: BrowserWindowUndoc
	}

	type NewWindowEventListener = (event: NewWindowExtendedEvent,
		url: string,
		frameName: string,
		disposition: string,
		options: Electron.BrowserWindowConstructorOptions,
		additionalFeatures: string[],
		referrer: Electron.Referrer,
		postBody: Electron.PostBody) => void;

	type NewWindowEventListenerWrapper = (parentWindow: Electron.BrowserWindow) => NewWindowEventListener;

	interface ConfigNames {
		openBrowser: string;
		minToTray: string;
		x: string;
		y: string;
		width: string;
		height: string;
		maximized: string;
		hideMenu: string;
	}

	interface ConfigDefaults {
		openBrowser: boolean;
		minToTray: boolean;
		x: number;
		y: number;
		width: number;
		height: number;
		maximized: boolean;
		hideMenu: boolean;
	}

	interface Config {
		names: ConfigNames;
		defaults: ConfigDefaults;
		store: import("configstore");
	}
}
