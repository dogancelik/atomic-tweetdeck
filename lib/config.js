const pkg = require('../package.json');
const Configstore = require('configstore');

exports.names = {
  openBrowser: 'openBrowser',
  minToTray: 'minToTray',
  x: 'x',
  y: 'y',
  width: 'width',
  height: 'height',
  maximized: 'maximized',
  hideMenu: 'hideMenu',
};

exports.defaults = {
  openBrowser: true,
  minToTray: false,
  x: 0,
  y: 0,
  width: 400,
  height: 400,
  maximized: false,
  hideMenu: false,
};

exports.store = new Configstore(pkg.name, exports.defaults);
