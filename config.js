const pkg = require('./package.json');
const Configstore = require('configstore');

exports.names = {
  openBrowser: 'openBrowser',
  minToTray: 'minToTray',
};

exports.defaults = {
  openBrowser: true,
  minToTray: false,
};

exports.store = new Configstore(pkg.name, exports.defaults);
