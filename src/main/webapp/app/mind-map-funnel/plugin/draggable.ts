import { $document, $win } from '../config';
import { customizeUtil } from '../util';
import { MindMapMain } from '../mind-map-main';
import { MindMapNode } from '../mind-map-node';

const jcanvas = customizeUtil.canvas;
const jdom = customizeUtil.dom;

const clearSelection =
  'getSelection' in $win
    ? function() {
        $win.getSelection().removeAllRanges();
      }
    : function() {
        $document.selection.empty();
      };

const options = {
  lineWidth: 5,
  lookupDelay: 500,
  lookupInterval: 80
};

export class Draggable {
  jm: MindMapMain;
  eCanvas: any;
  canvasCtx: any;
  shadow: any;
  shadowWidth: number;
  shadowHeight: number;
  activeNode: any;
  targetNode: any;
  targetDirect: any;
  clientWidth: number;
  clientHeight: number;
  offsetX: number;
  offsetY: number;
  hlookupDelay: number;
  hlookupTimer: number;
  capture: boolean;
  moved: boolean;
  clientHW: number;
  clientHH: number;

  constructor(jm) {
    this.jm = jm;
    this.eCanvas = null;
    this.canvasCtx = null;
    this.shadow = null;
    this.shadowWidth = 0;
    this.shadowHeight = 0;
    this.activeNode = null;
    this.targetNode = null;
    this.targetDirect = null;
    this.clientWidth = 0;
    this.clientHeight = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.hlookupDelay = 0;
    this.hlookupTimer = 0;
    this.capture = false;
    this.moved = false;
  }

  init() {
    this._createCanvas();
    this._createShadow();
    this._eventBind();
  }

  resize() {
    this.jm.view.eNodes.appendChild(this.shadow);
    this.eCanvas.width = this.jm.view.size.w;
    this.eCanvas.height = this.jm.view.size.h;
  }

  _createCanvas() {
    const c = $document.createElement('canvas');
    this.jm.view.ePanel.appendChild(c);
    const ctx = c.getContext('2d');
    this.eCanvas = c;
    this.canvasCtx = ctx;
  }

  _createShadow() {
    const s = $document.createElement('jmnode');
    s.style.visibility = 'hidden';
    s.style.zIndex = '3';
    s.style.cursor = 'move';
    s.style.opacity = '0.7';
    this.shadow = s;
  }

  resetShadow(el) {
    const s = this.shadow.style;
    this.shadow.innerHTML = el.innerHTML;
    s.left = el.style.left;
    s.top = el.style.top;
    s.width = el.style.width;
    s.height = el.style.height;
    s.backgroundImage = el.style.backgroundImage;
    s.backgroundSize = el.style.backgroundSize;
    s.transform = el.style.transform;
    this.shadowWidth = this.shadow.clientWidth;
    this.shadowHeight = this.shadow.clientHeight;
  }

  showShadow() {
    if (!this.moved) {
      this.shadow.style.visibility = 'visible';
    }
  }

  hideShadow() {
    this.shadow.style.visibility = 'hidden';
  }

  clearLines() {
    jcanvas.clear(this.canvasCtx, 0, 0, this.jm.view.size.w, this.jm.view.size.h);
  }

  _magnetShadow(node) {
    if (node) {
      this.canvasCtx.lineWidth = options.lineWidth;
      this.canvasCtx.strokeStyle = 'rgba(0,0,0,0.3)';
      this.canvasCtx.lineCap = 'round';
      this.clearLines();
      jcanvas.lineto(this.canvasCtx, node.sp.x, node.sp.y, node.np.x, node.np.y);
    }
  }

  _lookupCloseNode() {
    const root = this.jm.mind.root;
    const rootLocation = root.getLocation();
    const rootSize = root.getSize();
    const rootX = rootLocation.x + rootSize.w / 2;

    const sw = this.shadowWidth;
    const sh = this.shadowHeight;
    const sx = this.shadow.offsetLeft;
    const sy = this.shadow.offsetTop;

    let ns, nl;

    const direct = sx + sw / 2 >= rootX ? MindMapMain.direction.right : MindMapMain.direction.left;
    const nodes = this.jm.mind.nodes;
    let node = null;
    let minDistance = Number.MAX_VALUE;
    let distance = 0;
    let closestNode = null;
    let closestP = null;
    let shadowP = null;
    for (const nodeid in nodes) {
      if(nodeid) {

      let np, sp;
      node = nodes[nodeid];
      if (node.isroot || node.direction === direct) {
        if (node.id === this.activeNode.id) {
          continue;
        }
        ns = node.getSize();
        nl = node.getLocation();
        if (direct === MindMapMain.direction.right) {
          if (sx - nl.x - ns.w <= 0) {
            continue;
          }
          distance = Math.abs(sx - nl.x - ns.w) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
          np = { x: nl.x + ns.w - options.lineWidth, y: nl.y + ns.h / 2 };
          sp = { x: sx + options.lineWidth, y: sy + sh / 2 };
        } else {
          if (nl.x - sx - sw <= 0) {
            continue;
          }
          distance = Math.abs(sx + sw - nl.x) + Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
          np = { x: nl.x + options.lineWidth, y: nl.y + ns.h / 2 };
          sp = { x: sx + sw - options.lineWidth, y: sy + sh / 2 };
        }
        if (distance < minDistance) {
          closestNode = node;
          closestP = np;
          shadowP = sp;
          minDistance = distance;
        }
      }
      }
    }
    let resultNode = null;
    if (closestNode) {
      resultNode = {
        node: closestNode,
        direction: direct,
        sp: shadowP,
        np: closestP
      };
    }
    return resultNode;
  }

  lookupCloseNode() {
    const nodeData = this._lookupCloseNode();
    if (nodeData) {
      this._magnetShadow(nodeData);
      this.targetNode = nodeData.node;
      this.targetDirect = nodeData.direction;
    }
  }

  _eventBind() {
    const container = this.jm.view.container;
    jdom.addEvent(container, 'mousedown', (e) => {
      const evt = e || event;
      this.dragstart.call(this, evt);
    });
    jdom.addEvent(container, 'mousemove', (e) => {
      const evt = e || event;
      this.drag.call(this, evt);
    });
    jdom.addEvent(container, 'mouseup', (e) => {
      const evt = e || event;
      this.dragend.call(this);
    });
    jdom.addEvent(container, 'touchstart', (e) => {
      const evt = e || event;
      this.dragstart.call(this, evt);
    });
    jdom.addEvent(container, 'touchmove', (e) => {
      const evt = e || event;
      this.drag.call(this, evt);
    });
    jdom.addEvent(container, 'touchend', (e) => {
      const evt = e || event;
      this.dragend.call(this);
    });
  }

  dragstart(e) {
    if (!this.jm.getEditable()) {
      return;
    }
    if (this.capture) {
      return;
    }
    this.activeNode = null;

    const jview = this.jm.view;
    const el = e.target || event.srcElement;
    if (el.tagName.toLowerCase() !== 'jmnode') {
      return;
    }
    const nodeid = jview.getBindedNodeId(el);
    if (nodeid) {
      const node = this.jm.getNode(nodeid);
      if (!node.isroot) {
        this.resetShadow(el);
        this.activeNode = node;
        this.offsetX = (e.clientX || e.touches[0].clientX) - el.offsetLeft;
        this.offsetY = (e.clientY || e.touches[0].clientY) - el.offsetTop;
        this.clientHW = Math.floor(el.clientWidth / 2);
        this.clientHH = Math.floor(el.clientHeight / 2);
        if (this.hlookupDelay !== 0) {
          $win.clearTimeout(this.hlookupDelay);
        }
        if (this.hlookupTimer !== 0) {
          $win.clearInterval(this.hlookupTimer);
        }

        this.hlookupDelay = $win.setTimeout(() => {
          this.hlookupDelay = 0;
          this.hlookupTimer = $win.setInterval(() => {
            this.lookupCloseNode.call(this);
          }, options.lookupInterval);
        }, options.lookupDelay);
        this.capture = true;
      }
    }
  }

  drag(e) {
    if (!this.jm.getEditable()) {
      return;
    }
    if (this.capture) {
      e.preventDefault();
      this.showShadow();
      this.moved = true;
      clearSelection();
      const px = (e.clientX || e.touches[0].clientX) - this.offsetX;
      const py = (e.clientY || e.touches[0].clientY) - this.offsetY;
      this.shadow.style.left = px + 'px';
      this.shadow.style.top = py + 'px';
      clearSelection();
    }
  }

  dragend() {
    if (!this.jm.getEditable()) {
      return;
    }
    if (this.capture) {
      if (this.hlookupDelay !== 0) {
        $win.clearTimeout(this.hlookupDelay);
        this.hlookupDelay = 0;
        this.clearLines();
      }
      if (this.hlookupTimer !== 0) {
        $win.clearInterval(this.hlookupTimer);
        this.hlookupTimer = 0;
        this.clearLines();
      }
      if (this.moved) {
        const srcNode = this.activeNode;
        const targetNode = this.targetNode;
        const targetDirect = this.targetDirect;
        this.moveNode(srcNode, targetNode, targetDirect);
      }
      this.hideShadow();
    }
    this.moved = false;
    this.capture = false;
  }

  moveNode(srcNode, targetNode, targetDirect) {
    const shadowH = this.shadow.offsetTop;
    if (targetNode && srcNode && !MindMapNode.inherited(srcNode, targetNode)) {
      // lookup before_node
      const siblingNodes = targetNode.children;
      let sc = siblingNodes.length;
      let node = null;
      let deltaY = Number.MAX_VALUE;
      let nodeBefore = null;
      let beforeid = '_last_';
      while (sc--) {
        node = siblingNodes[sc];
        if (node.direction === targetDirect && node.id !== srcNode.id) {
          const dy = node.getLocation().y - shadowH;
          if (dy > 0 && dy < deltaY) {
            deltaY = dy;
            nodeBefore = node;
            beforeid = '_first_';
          }
        }
      }
      if (nodeBefore) {
        beforeid = nodeBefore.id;
      }
      this.jm.moveNode(srcNode.id, beforeid, targetNode.id, targetDirect);
    }
    this.activeNode = null;
    this.targetNode = null;
    this.targetDirect = null;
  }

  jmEventHandle(type) {
    if (type === MindMapMain.eventType.resize) {
      this.resize();
    }
  }
}
