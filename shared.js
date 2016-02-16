// Reference from https://github.com/yoshuawuyts/vmd/blob/master/shared/create-menu.js
const isRenderer = process.type === 'renderer';
const electron = require('electron');
const Menu = isRenderer ? electron.remote.Menu : electron.Menu;
const MenuItem = isRenderer ? electron.remote.MenuItem : electron.MenuItem;

exports.CustomMenu = function (template, model) {
  var _menu = new Menu();
  var _model = model;

  function updateMenuItems (model, tplArr, p) {
    tplArr.forEach(function (tplItem) {
      if (!tplItem._item) {
        tplItem._item = new MenuItem({
          type: tplItem.type,
          label: tplItem.label,
          accelerator: tplItem.accelerator,
          role: tplItem.role,
          selector: tplItem.selector,
          click: function (item, win) {
            tplItem.click(_ret.getModel(), item, win)
          },
          submenu: Array.isArray(tplItem.submenu) ? new Menu() : null
        })

        p.append(tplItem._item)
      }

      if (typeof tplItem.visible === 'function') {
        tplItem._item.visible = tplItem.visible(model, tplItem._item)
      }

      if (typeof tplItem.enabled === 'function') {
        tplItem._item.enabled = tplItem.enabled(model, tplItem._item)
      }

      if (tplItem._item.submenu) {
        updateMenuItems(model, tplItem.submenu, tplItem._item.submenu)
      }
    })

    return p
  }

  var _ret = {
    getMenu: function () { return _menu; },
    getModel: function () { return _model; },
    update: function (model) {
      _model = model
      updateMenuItems(_ret.getModel(), template, _ret.getMenu())
    }
  };

  updateMenuItems(_ret.getModel(), template, _ret.getMenu())
  return _ret;
};
