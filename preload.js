const remote = require('electron').remote;
const url = remote.require('url');
const clipboard = remote.clipboard;
const shared = require('./shared');

shared.watchExceptions();

//remote.getCurrentWindow().toggleDevTools();

function findClosestNode (nodeName, el) {
  for (; el && el !== document; el = el.parentNode) {
    if (el.nodeName === nodeName) {
      return el
    }
  }

  return null
}

const findClosestLink = findClosestNode.bind(null, 'A');
const findClosestImage = findClosestNode.bind(null, 'IMG');
const findClosestVideo = findClosestNode.bind(null, 'VIDEO');

function getLinkType (el) {
  if (!el) return null;

  const href = el.getAttribute('href') || el.getAttribute('src')

  if (!href) return null;

  const filePath = document.body.getAttribute('data-filepath');
  const parsed = url.parse(href);
  const hash = parsed.hash;
  const protocol = parsed.protocol;
  const pathname = parsed.pathname;

  if (protocol && protocol !== 'file:') {
    return {
      type: 'external',
      href: href
    };
  }

  return null;
}

function getContextMenuTemplate () {
  return [{
    label: 'Copy &page address',
    click: (model) => clipboard.writeText(model.window.location.href),
    visible: (model) => !model.text && !model.link && !model.img
  }, {
    label: 'Copy selected &text',
    click: (model) => clipboard.writeText(model.text),
    visible: (model) => !!model.text
  }, {
    label: 'Copy &link address',
    click: (model) => model.link && clipboard.writeText(model.link.href),
    visible: (model) => model.link && model.link.type === 'external'
  }, {
    label: 'Copy &image',
    click: (model) => model._webContents.copyImageAt(model.x, model.y),
    visible: (model) => model.img
  }, {
    label: 'Copy &image address',
    click: (model) => model.img && clipboard.writeText(model.img.href),
    visible: (model) => model.img && model.img.type === 'external'
  }, {
    label: 'Copy &video address',
    click: (model) => model.video && clipboard.writeText(model.video.href),
    visible: (model) => model.video && model.video.type === 'external'
  }];
};

var contextMenu = new shared.CustomMenu(getContextMenuTemplate(), {
  _window: remote.getCurrentWindow(),
  _webContents: remote.getCurrentWebContents(),
});

function openContextMenu (e) {
  e.preventDefault();

  var wnd = remote.getCurrentWindow();
  var sel = window.getSelection();
  var selText = sel.toString();
  var el = document.elementFromPoint(e.x, e.y) || null;

  contextMenu.update({
    x: e.x,
    y: e.y,
    text: selText,
    el: el,
    link: getLinkType(findClosestLink(el)),
    img: getLinkType(findClosestImage(el)),
    video: getLinkType(findClosestVideo(el)),
    window: window
  });

  contextMenu.getMenu().popup(wnd);
};

window.addEventListener('contextmenu', openContextMenu, false);
