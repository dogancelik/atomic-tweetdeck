exports.createMutex = function () {
  var shouldQuit = app.makeSingleInstance(function() {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.show();
        mainWindow.maximize();
        mainWindow.focus();
      }
    }
    return true;
  });

  if (shouldQuit) {
    app.quit();
    return;
  }
};
