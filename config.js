const pkg = require('./package.json');
const Configstore = require('configstore');

exports.names = {
  openBrowser: 'openBrowser',
  minToTray: 'minToTray',
  hideMenu: 'hideMenu',
};

exports.defaults = {
  openBrowser: true,
  minToTray: false,
  hideMenu: false,
};

exports.store = new Configstore(pkg.name, exports.defaults);
