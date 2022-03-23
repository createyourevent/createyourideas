import { CalcProvider } from './mind-map-calc';
import { logger } from './config';
import { MindMapNode } from './mind-map-node';
import { customizeUtil } from './util';
import { MindMapMain, MindMapModuleOpts } from './mind-map-main';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'app/entities/user/user.model';

export class MindMapMind {
  name = null;
  author = null;
  version = null;
  root = null;
  selected = null;
  nodes = {};
  calc: CalcProvider;
  opts: MindMapModuleOpts;
  translate: TranslateService;
  user: IUser;

  constructor(calc?: CalcProvider, opts?: MindMapModuleOpts) {
    this.calc = calc;
    this.opts = opts;
  }

  getNode(nodeid) {
    if (nodeid in this.nodes) {
      return this.nodes[nodeid];
    } else {
      logger.warn('the node[id=' + nodeid + '] can not be found');
      return null;
    }
  }

  setRoot(nodeid, topic, data, interest?, investment?, distribution?, description?, active?, logo?, logoContentType?, income?, outgoing?, donations?, user?) {
    if (this.root == null) {
      this.root = new MindMapNode(
        nodeid,
        0,
        topic,
        data,
        true,
        null,
        null,
        null,
        null,
        null,
        null,
        interest,
        investment,
        distribution,
        description,
        active,
        logo,
        logoContentType,
        income,
        outgoing,
        donations,
        user
      );
      this.putNode(this.root);
    } else {
      logger.error('root node is already exist');
    }
  }

  getCurrentHierarchyRule(parentNode) {
    if (!this.opts.hierarchyRule) {
      return null;
    }
    if (parentNode.isroot) {
      return this.opts.hierarchyRule.ROOT.getChildren()[0];
    }
    return _.find(this.opts.hierarchyRule, { name: parentNode.selectedType }).getChildren()[0];
  }

  addNode(
    parentNode,
    nodeid,
    topic,
    data,
    idx,
    direction?,
    expanded?,
    selectedType?,
    level?,
    selectable?,
    interest?,
    investment?,
    distribution?,
    description?,
    active?,
    logo?,
    logoContentType?,
    income?,
    outgoing?,
    donations?,
    user?
  ) {
    if (!customizeUtil.isNode(parentNode)) {
      return this.addNode(
        this.getNode(parentNode),
        nodeid,
        topic,
        data,
        idx,
        direction,
        expanded,
        selectedType,
        level,
        selectable,
        interest,
        investment,
        distribution,
        description,
        active,
        logo,
        logoContentType,
        income,
        outgoing,
        donations,
        user
      );
    }
    const nodeindex = idx || -1;

    if (parentNode) {
      // logger.debug(parentNode);

      const currentRule = this.getCurrentHierarchyRule(parentNode);
      const selType = currentRule && currentRule.name;
      if (!selType && this.opts.hierarchyRule) {
        throw new Error('forbidden add');
      } else {
        topic = topic || `${selType}select`;
      }
      if (currentRule && currentRule.backgroundColor) {
        data['background-color'] = currentRule.backgroundColor;
      }
      if (currentRule && currentRule.color) {
        data['color'] = currentRule.color;
      }

      let node = null;
      if (parentNode.isroot) {
        let d = MindMapMain.direction.right;
        if (isNaN(direction)) {
          // const children = parentNode.children;
          // const children_len = children.length;
          // let r = 0;
          // for(var i=0;i<children_len;i++){if(children[i].direction === jm.direction.left){r--;}else{r++;}}
          d = MindMapMain.direction.right;
        } else {
          d = direction !== MindMapMain.direction.left ? MindMapMain.direction.right : MindMapMain.direction.left;
        }
        node = new MindMapNode(
          nodeid,
          nodeindex,
          topic,
          data,
          false,
          parentNode,
          d,
          expanded,
          selectedType,
          parentNode.level + 1,
          selectable,
          interest,
          investment,
          distribution,
          description,
          active,
          logo,
          logoContentType,
          income,
          outgoing,
          donations,
          user
        );
      } else {
        node = new MindMapNode(
          nodeid,
          nodeindex,
          topic,
          data,
          false,
          parentNode,
          parentNode.direction,
          expanded,
          selectedType,
          parentNode.level + 1,
          selectable,
          interest,
          investment,
          distribution,
          description,
          active,
          logo,
          logoContentType,
          income,
          outgoing,
          donations,
          user
        );
      }
      if (this.putNode(node)) {
        parentNode.children.push(node);
        this.reindex(parentNode);
      } else {
        logger.error("fail, the nodeid '" + node.id + "' has been already exist.");
        node = null;
      }
      return node;
    } else {
      logger.error('fail, the [node_parent] can not be found.');
      return null;
    }
  }

  insertNodeBefore(nodeBefore, nodeid, topic, data, interest?, investment?, distribution?) {
    if (!customizeUtil.isNode(nodeBefore)) {
      return this.insertNodeBefore(this.getNode(nodeBefore), nodeid, topic, data, interest, investment, distribution);
    }
    if (nodeBefore) {
      const nodeIndex = nodeBefore.index - 0.5;
      return this.addNode(nodeBefore.parent, nodeid, topic, data, nodeIndex, null, null, null, null, interest, investment, distribution);
    } else {
      logger.error('fail, the [node_before] can not be found.');
      return null;
    }
  }

  getNodeBefore(node) {
    if (!node) {
      return null;
    }
    if (!customizeUtil.isNode(node)) {
      return this.getNodeBefore(this.getNode(node));
    }
    if (node.isroot) {
      return null;
    }
    const idx = node.index - 2;
    if (idx >= 0) {
      return node.parent.children[idx];
    } else {
      return null;
    }
  }

  insertNodeAfter(nodeAfter, nodeid, topic, data, interest?, investment?, distribution?) {
    if (!customizeUtil.isNode(nodeAfter)) {
      return this.insertNodeAfter(this.getNode(nodeAfter), nodeid, topic, data, interest, investment, distribution);
    }
    if (nodeAfter) {
      const nodeIndex = nodeAfter.index + 0.5;
      return this.addNode(nodeAfter.parent, nodeid, topic, data, nodeIndex, null, null, null, null, interest, investment, distribution);
    } else {
      logger.error('fail, the [node_after] can not be found.');
      return null;
    }
  }

  getNodeAfter(node) {
    if (!node) {
      return null;
    }
    if (!customizeUtil.isNode(node)) {
      return this.getNodeAfter(this.getNode(node));
    }
    if (node.isroot) {
      return null;
    }
    const idx = node.index;
    const brothers = node.parent.children;
    if (brothers.length >= idx) {
      return node.parent.children[idx];
    } else {
      return null;
    }
  }

  moveNode(node, beforeid, parentid, direction) {
    if (!customizeUtil.isNode(node)) {
      return this.moveNode(this.getNode(node), beforeid, parentid, direction);
    }
    if (!parentid) {
      parentid = node.parent.id;
    }
    return this.moveNodeDirect(node, beforeid, parentid, direction);
  }

  flowNodeDirection(node, direction?) {
    if (typeof direction === 'undefined') {
      direction = node.direction;
    } else {
      node.direction = direction;
    }
    let len = node.children.length;
    while (len--) {
      this.flowNodeDirection(node.children[len], direction);
    }
  }

  moveNodeInternal(node, beforeid) {
    if (node && beforeid) {
      if (beforeid === '_last_') {
        node.index = -1;
        this.reindex(node.parent);
      } else if (beforeid === '_first_') {
        node.index = 0;
        this.reindex(node.parent);
      } else {
        const nodeBefore = beforeid ? this.getNode(beforeid) : null;
        if (nodeBefore != null && nodeBefore.parent != null && nodeBefore.parent.id === node.parent.id) {
          node.index = nodeBefore.index - 0.5;
          this.reindex(node.parent);
        }
      }
    }
    return node;
  }

  moveNodeDirect(node, beforeid, parentid, direction) {
    if (node && parentid) {
      if (node.parent.id !== parentid) {
        // remove from parent's children
        const sibling = node.parent.children;
        let si = sibling.length;
        while (si--) {
          if (sibling[si].id === node.id) {
            sibling.splice(si, 1);
            break;
          }
        }
        node.parent = this.getNode(parentid);
        node.parent.children.push(node);
      }

      if (node.parent.isroot) {
        if (direction === MindMapMain.direction.left) {
          node.direction = direction;
        } else {
          node.direction = MindMapMain.direction.right;
        }
      } else {
        node.direction = node.parent.direction;
      }
      this.moveNodeInternal(node, beforeid);
      this.flowNodeDirection(node);
    }
    return node;
  }

  removeNode(node) {
    if (!customizeUtil.isNode(node)) {
      return this.removeNode(this.getNode(node));
    }
    if (!node) {
      logger.error('fail, the node can not be found');
      return false;
    }
    if (node.isroot) {
      logger.error('fail, can not remove root node');
      return false;
    }
    if (this.selected != null && this.selected.id === node.id) {
      this.selected = null;
    }
    // clean all subordinate nodes
    const children = node.children;
    let ci = children.length;
    while (ci--) {
      this.removeNode(children[ci]);
    }
    // clean all children
    children.length = 0;
    // remove from parent's children
    const sibling = node.parent.children;
    let si = sibling.length;
    while (si--) {
      if (sibling[si].id === node.id) {
        sibling.splice(si, 1);
        break;
      }
    }
    // remove from global nodes
    delete this.nodes[node.id];
    // clean all properties
    for (const k in node) {
      if (k) delete node[k];
    }
    // remove it's self
    node = null;
    // delete node;
    return true;
  }

  putNode(node) {
    if (node.id in this.nodes) {
      logger.warn("the nodeid '" + node.id + "' has been already exist.");
      return false;
    } else {
      this.nodes[node.id] = node;
      return true;
    }
  }

  reindex(node) {
    if (node instanceof MindMapNode) {
      node.children.sort(MindMapNode.compare);
      const length = node.children.length;
      for (let i = 0; i < length; i++) {
        node.children[i].index = i + 1;
      }
    }
  }
}
