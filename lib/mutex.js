exports.createMutex = function () {
  const gotLock = global.app.requestSingleInstanceLock();

  global.app.on('second-instance', (event, argv, cwd) => {
    if (global.mainWindow) {
      if (global.mainWindow.isMinimized()) {
        global.mainWindow.restore();
        global.mainWindow.show();
        global.mainWindow.focus();
      }
    }
  });

  if (!gotLock) {
    return global.app.quit();
  }
};
