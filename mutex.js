exports.createMutex = function () {
  var shouldQuit = app.makeSingleInstance(function() {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
        mainWindow.show();
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
