exports.createMutex = function () {
  const gotLock = app.requestSingleInstanceLock();

  app.on('second-instance', (event, argv, cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  if (!gotLock) {
    return app.quit();
  }
};
