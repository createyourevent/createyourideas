import { customizeUtil } from './util';
import { $document } from './config';
import { MindMapMain } from './mind-map-main';

export class ShortcutProvider {
  jm;
  opts;
  mapping;
  handles;
  _mapping = {};

  constructor(jm, options) {
    this.jm = jm;
    this.opts = options;
    this.mapping = options.mapping;
    this.handles = options.handles;
  }

  init() {
    customizeUtil.dom.addEvent($document, 'keydown', this.handler.bind(this));

    this.handles['addchild'] = this.handleAddChild;
    this.handles['addbrother'] = this.handleAddBrother;
    this.handles['editnode'] = this.handleEditNode;
    this.handles['delnode'] = this.handleDelNode;
    this.handles['toggle'] = this.handleToggle;
    this.handles['up'] = this.handleUp;
    this.handles['down'] = this.handleDown;
    this.handles['left'] = this.handleLeft;
    this.handles['right'] = this.handleRight;

    for (const handle in this.mapping) {
      if (this.mapping[handle] && handle in this.handles) {
        this._mapping[this.mapping[handle]] = this.handles[handle];
      }
    }
  }

  enableShortcut() {
    this.opts.enable = true;
  }

  disableShortcut() {
    this.opts.enable = false;
  }

  handler(e) {
    if (this.jm.view.isEditing()) {
      return;
    }
    const evt = e || event;
    if (!this.opts.enable) {
      return true;
    }
    const kc = evt.keyCode;
    if (kc in this._mapping) {
      this._mapping[kc].call(this, this.jm, e);
    }
  }

  handleAddChild(_jm) {
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode) {
      const nodeid = customizeUtil.uuid.newid();
      const node = _jm.addNode(selectedNode, nodeid, 'New Node');
      if (node) {
        _jm.selectNode(nodeid);
        _jm.beginEdit(nodeid);
      }
    }
  }

  handleAddBrother(_jm) {
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode && !selectedNode.isroot) {
      const nodeid = customizeUtil.uuid.newid();
      const node = _jm.insertNodeAfter(selectedNode, nodeid, 'New Node');
      if (node) {
        _jm.selectNode(nodeid);
        _jm.beginEdit(nodeid);
      }
    }
  }

  handleEditNode(_jm) {
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode) {
      _jm.beginEdit(selectedNode);
    }
  }

  handleDelNode(_jm) {
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode && !selectedNode.isroot) {
      _jm.selectNode(selectedNode.parent);
      _jm.removeNode(selectedNode);
    }
  }

  handleToggle(_jm, e) {
    const evt = e || event;
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode) {
      _jm.toggleNode(selectedNode.id);
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  handleUp(_jm, e) {
    const evt = e || event;
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode) {
      let upNode = _jm.findNodeBefore(selectedNode);
      if (!upNode) {
        const np = _jm.findNodeBefore(selectedNode.parent);
        if (np && np.children.length > 0) {
          upNode = np.children[np.children.length - 1];
        }
      }
      if (upNode) {
        _jm.selectNode(upNode);
      }
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  handleDown(_jm, e) {
    const evt = e || event;
    const selectedNode = _jm.getSelectedNode();
    if (selectedNode) {
      let downNode = _jm.findNodeAfter(selectedNode);
      if (!downNode) {
        const np = _jm.findNodeAfter(selectedNode.parent);
        if (np && np.children.length > 0) {
          downNode = np.children[0];
        }
      }
      if (downNode) {
        _jm.selectNode(downNode);
      }
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  handleLeft(_jm, e) {
    this._handleDirection(_jm, e, MindMapMain.direction.left);
  }

  handleRight(_jm, e) {
    this._handleDirection(_jm, e, MindMapMain.direction.right);
  }

  _handleDirection(_jm, e, d) {
    const evt = e || event;
    const selectedNode = _jm.getSelectedNode();
    let node = null;
    if (selectedNode) {
      if (selectedNode.isroot) {
        const c = selectedNode.children;
        const children = [];
        for (let i = 0; i < c.length; i++) {
          if (c[i].direction === d) {
            children.push(i);
          }
        }
        node = c[children[Math.floor((children.length - 1) / 2)]];
      } else if (selectedNode.direction === d) {
        const children = selectedNode.children;
        const childrencount = children.length;
        if (childrencount > 0) {
          node = children[Math.floor((childrencount - 1) / 2)];
        }
      } else {
        node = selectedNode.parent;
      }
      if (node) {
        _jm.selectNode(node);
      }
      evt.stopPropagation();
      evt.preventDefault();
    }
  }
}
