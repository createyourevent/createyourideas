import { logger } from './config';
import { MindMapMain } from './mind-map-main';

export class LayoutProvider {
  opts;
  jm;
  isside;
  bounds = null;
  cacheValid = false;

  constructor(jm, options) {
    this.opts = options;
    this.jm = jm;
    this.isside = this.opts.mode === 'side';
  }

  init() {
    logger.debug('layout.init');
  }

  reset() {
    logger.debug('layout.reset');
    this.bounds = { n: 0, s: 0, w: 0, e: 0 };
  }

  layout() {
    logger.debug('layout.layout');
    this.layoutDirection();
    this.layoutOffset();
  }

  layoutDirection() {
    this._layoutDirectionRoot();
  }

  _layoutDirectionRoot() {
    const node = this.jm.mind.root;
    // logger.debug(node);
    let layoutData = null;
    if ('layout' in node._data) {
      layoutData = node._data.layout;
    } else {
      layoutData = {};
      node._data.layout = layoutData;
    }
    const children = node.children;
    const childrenCount = children.length;
    layoutData.direction = MindMapMain.direction.center;
    layoutData.sideIndex = 0;
    if (this.isside) {
      let i = childrenCount;
      while (i--) {
        this._layoutDirectionSide(children[i], MindMapMain.direction.right, i);
      }
    } else {
      let i = childrenCount;
      let subnode = null;
      while (i--) {
        subnode = children[i];
        if (subnode.direction === MindMapMain.direction.left) {
          this._layoutDirectionSide(subnode, MindMapMain.direction.left, i);
        } else {
          this._layoutDirectionSide(subnode, MindMapMain.direction.right, i);
        }
      }
      /*
             var boundary = Math.ceil(childrenCount/2);
             var i = childrenCount;
             while(i--){
             if(i>=boundary){
             this._layoutDirectionSide(children[i],jm.direction.left, childrenCount-i-1);
             }else{
             this._layoutDirectionSide(children[i],jm.direction.right, i);
             }
             }*/
    }
  }

  _layoutDirectionSide(node, direction, sideIndex) {
    let layoutData = null;
    if ('layout' in node._data) {
      layoutData = node._data.layout;
    } else {
      layoutData = {};
      node._data.layout = layoutData;
    }
    const children = node.children;
    const childrenCount = children.length;

    layoutData.direction = direction;
    layoutData.sideIndex = sideIndex;
    let i = childrenCount;
    while (i--) {
      this._layoutDirectionSide(children[i], direction, i);
    }
  }

  layoutOffset() {
    const node = this.jm.mind.root;
    const layoutData = node._data.layout;
    layoutData.offsetX = 0;
    layoutData.offsetY = 0;
    layoutData.outerHeight = 0;
    const children = node.children;
    let i = children.length;
    const leftNodes = [];
    const rightNodes = [];
    let subnode = null;
    while (i--) {
      subnode = children[i];
      if (subnode._data.layout.direction === MindMapMain.direction.right) {
        rightNodes.unshift(subnode);
      } else {
        leftNodes.unshift(subnode);
      }
    }
    layoutData.leftNodes = leftNodes;
    layoutData.rightNodes = rightNodes;
    layoutData.outerHeightLeft = this._layoutOffsetSubNodes(leftNodes);
    layoutData.outerHeightRight = this._layoutOffsetSubNodes(rightNodes);
    this.bounds.e = node._data.view.width / 2;
    this.bounds.w = 0 - this.bounds.e;
    this.bounds.n = 0;
    this.bounds.s = Math.max(layoutData.outerHeightLeft, layoutData.outerHeightRight);
  }

  // layout both the x and y axis
  _layoutOffsetSubNodes(nodes) {
    let totalHeight = 0;
    const nodesCount = nodes.length;
    let i = nodesCount;
    let node = null;
    let nodeOuterHeight = 0;
    let layoutData = null;
    let baseY = 0;
    let pd = null; // parent._data
    while (i--) {
      node = nodes[i];
      layoutData = node._data.layout;
      if (pd == null) {
        pd = node.parent._data;
      }

      nodeOuterHeight = this._layoutOffsetSubNodes(node.children);
      if (!node.expanded) {
        nodeOuterHeight = 0;
        this.setVisible(node.children, false);
      }
      nodeOuterHeight = Math.max(node._data.view.height, nodeOuterHeight);

      layoutData.outerHeight = nodeOuterHeight;
      layoutData.offsetY = baseY - nodeOuterHeight / 2;
      layoutData.offsetX = this.opts.hspace * layoutData.direction + (pd.view.width * (pd.layout.direction + layoutData.direction)) / 2;
      if (!node.parent.isroot) {
        layoutData.offsetX += this.opts.pspace * layoutData.direction;
      }

      baseY = baseY - nodeOuterHeight - this.opts.vspace;
      totalHeight += nodeOuterHeight;
    }
    if (nodesCount > 1) {
      totalHeight += this.opts.vspace * (nodesCount - 1);
    }
    i = nodesCount;
    const middleHeight = totalHeight / 2;
    while (i--) {
      node = nodes[i];
      node._data.layout.offsetY += middleHeight;
    }
    return totalHeight;
  }

  // layout the y axis only, for collapse/expand a node
  _layoutOffsetSubNodesHeight(nodes) {
    let totalHeight = 0;
    const nodesCount = nodes.length;
    let i = nodesCount;
    let node = null;
    let nodeOuterHeight = 0;
    let layoutData = null;
    let baseY = 0;
    let pd = null; // parent._data
    while (i--) {
      node = nodes[i];
      layoutData = node._data.layout;
      if (pd == null) {
        pd = node.parent._data;
      }

      nodeOuterHeight = this._layoutOffsetSubNodesHeight(node.children);
      if (!node.expanded) {
        nodeOuterHeight = 0;
      }
      nodeOuterHeight = Math.max(node._data.view.height, nodeOuterHeight);

      layoutData.outerHeight = nodeOuterHeight;
      layoutData.offsetY = baseY - nodeOuterHeight / 2;
      baseY = baseY - nodeOuterHeight - this.opts.vspace;
      totalHeight += nodeOuterHeight;
    }
    if (nodesCount > 1) {
      totalHeight += this.opts.vspace * (nodesCount - 1);
    }
    i = nodesCount;
    const middleHeight = totalHeight / 2;
    while (i--) {
      node = nodes[i];
      node._data.layout.offsetY += middleHeight;
    }
    return totalHeight;
  }

  getNodeOffset(node) {
    const layoutData = node._data.layout;
    let offsetCache = null;
    if ('_offset_' in layoutData && this.cacheValid) {
      offsetCache = layoutData._offset_;
    } else {
      offsetCache = { x: -1, y: -1 };
      layoutData._offset_ = offsetCache;
    }
    if (offsetCache.x === -1 || offsetCache.y === -1) {
      let x = layoutData.offsetX;
      let y = layoutData.offsetY;
      if (!node.isroot) {
        const offsetP = this.getNodeOffset(node.parent);
        x += offsetP.x;
        y += offsetP.y;
      }
      offsetCache.x = x;
      offsetCache.y = y;
    }
    return offsetCache;
  }

  getNodePoint(node) {
    const viewData = node._data.view;
    const offsetP = this.getNodeOffset(node);
    const p = { x: 0, y: 0 };
    p.x = offsetP.x + (viewData.width * (node._data.layout.direction - 1)) / 2;
    p.y = offsetP.y - viewData.height / 2;
    return p;
  }

  getNodePointBox(node) {
    const viewData = node._data.view;
    const offsetP = this.getNodeOffset(node);
    const p = { x: 0, y: 0 };
    p.x = offsetP.x + (viewData.width * (node._data.layout.direction - 1)) / 2;
    p.y = offsetP.y - viewData.height / 2;
    return p;
  }

  getNodePointIn(node) {
    return this.getNodeOffset(node);
  }

  getNodePointOut(node) {
    const layoutData = node._data.layout;
    let poutCache = null;
    if ('_pout_' in layoutData && this.cacheValid) {
      poutCache = layoutData._pout_;
    } else {
      poutCache = { x: -1, y: -1 };
      layoutData._pout_ = poutCache;
    }
    if (poutCache.x === -1 || poutCache.y === -1) {
      if (node.isroot) {
        poutCache.x = 0;
        poutCache.y = 0;
      } else {
        const viewData = node._data.view;
        const offsetP = this.getNodeOffset(node);
        poutCache.x = offsetP.x + (viewData.width + this.opts.pspace) * node._data.layout.direction;
        poutCache.y = offsetP.y;
      }
    }
    return poutCache;
  }

  getExpanderPoint(node) {
    const p = this.getNodePointOut(node);
    const exP = { x: 0, y: 0 };
    if (node._data.layout.direction === MindMapMain.direction.right) {
      exP.x = p.x - this.opts.pspace;
    } else {
      exP.x = p.x;
    }
    exP.y = p.y - Math.ceil(this.opts.pspace / 2);
    return exP;
  }

  getMinSize() {
    const nodes = this.jm.mind.nodes;
    let node = null;
    let pout = null;
    for (const nodeid in nodes) {
      if (nodeid) {
        node = nodes[nodeid];
        pout = this.getNodePointOut(node);
        if (pout.x > this.bounds.e) {
          this.bounds.e = pout.x;
        }
        if (pout.x < this.bounds.w) {
          this.bounds.w = pout.x;
        }
      }
    }
    return {
      w: this.bounds.e - this.bounds.w,
      h: this.bounds.s - this.bounds.n
    };
  }

  toggleNode(node) {
    if (node.isroot) {
      return;
    }
    if (node.expanded) {
      this.collapseNode(node);
    } else {
      this.expandNode(node);
    }
  }

  expandNode(node) {
    node.expanded = true;
    this.partLayout(node);
    this.setVisible(node.children, true);
  }

  collapseNode(node) {
    node.expanded = false;
    this.partLayout(node);
    this.setVisible(node.children, false);
  }

  expandAll() {
    const nodes = this.jm.mind.nodes;
    let c = 0;
    let node;
    for (const nodeid in nodes) {
      if (nodeid) {
        node = nodes[nodeid];
        if (!node.expanded) {
          node.expanded = true;
          c++;
        }
      }
    }
    if (c > 0) {
      const root = this.jm.mind.root;
      this.partLayout(root);
      this.setVisible(root.children, true);
    }
  }

  collapseAll() {
    const nodes = this.jm.mind.nodes;
    let c = 0;
    let node;
    for (const nodeid in nodes) {
      if (nodeid) {
        node = nodes[nodeid];
        if (node.expanded && !node.isroot) {
          node.expanded = false;
          c++;
        }
      }
    }
    if (c > 0) {
      const root = this.jm.mind.root;
      this.partLayout(root);
      this.setVisible(root.children, true);
    }
  }

  expandToDepth(targetDepth, currNodes?, currDepth?) {
    if (targetDepth < 1) {
      return;
    }
    const nodes = currNodes || this.jm.mind.root.children;
    const depth = currDepth || 1;
    let i = nodes.length;
    let node = null;
    while (i--) {
      node = nodes[i];
      if (depth < targetDepth) {
        if (!node.expanded) {
          this.expandNode(node);
        }
        this.expandToDepth(targetDepth, node.children, depth + 1);
      }
      if (depth === targetDepth) {
        if (node.expanded) {
          this.collapseNode(node);
        }
      }
    }
  }

  partLayout(node) {
    const root = this.jm.mind.root;
    if (root) {
      const rootLayoutData = root._data.layout;
      if (node.isroot) {
        rootLayoutData.outerHeightRight = this._layoutOffsetSubNodesHeight(rootLayoutData.rightNodes);
        rootLayoutData.outerHeightLeft = this._layoutOffsetSubNodesHeight(rootLayoutData.leftNodes);
      } else {
        if (node._data.layout.direction === MindMapMain.direction.right) {
          rootLayoutData.outerHeightRight = this._layoutOffsetSubNodesHeight(rootLayoutData.rightNodes);
        } else {
          rootLayoutData.outerHeightLeft = this._layoutOffsetSubNodesHeight(rootLayoutData.leftNodes);
        }
      }
      this.bounds.s = Math.max(rootLayoutData.outerHeightLeft, rootLayoutData.outerHeightRight);
      this.cacheValid = false;
    } else {
      logger.warn('can not found root node');
    }
  }

  setVisible(nodes, visible) {
    let i = nodes.length;
    let node = null;
    while (i--) {
      node = nodes[i];
      if (node.expanded) {
        this.setVisible(node.children, visible);
      } else {
        this.setVisible(node.children, false);
      }
      if (!node.isroot) {
        node._data.layout.visible = visible;
      }
    }
  }

  isExpand(node) {
    return node.expanded;
  }

  isVisible(node) {
    const layoutData = node._data.layout;
    if ('visible' in layoutData && !layoutData.visible) {
      return false;
    } else {
      return true;
    }
  }
}
