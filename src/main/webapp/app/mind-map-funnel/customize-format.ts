import { CalcProvider } from './mind-map-calc';
import * as _ from 'lodash';
import { $win, AUTHOR, logger, NAME, VERSION } from './config';
import { MindMapMain, MindMapModuleOpts } from './mind-map-main';
import { MindMapMind } from './mind-map-mind';
import { MindMapNode } from './mind-map-node';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'app/entities/user/user.model';

function getBasicMind(source, formatType: 'nodeTree' | 'nodeArray', calc: CalcProvider, opts: MindMapModuleOpts) {
  const df = customizeFormat[formatType];
  const mind = new MindMapMind(calc, opts);
  mind.name = _.get(source, 'meta.name', NAME);
  mind.author = _.get(source, 'meta.author', AUTHOR);
  mind.version = _.get(source, 'meta.version', VERSION);
  df._parse(mind, source.data, calc);
  return mind;
}

export const customizeFormat = {
  config: {
    selectable: true
  },
  setSelectable(val) {
    customizeFormat.config = {
      ...customizeFormat.config,
      selectable: val
    };
  },
  nodeTree: {
    example: {
      meta: {
        name: NAME,
        author: AUTHOR,
        version: VERSION
      },
      format: 'nodeTree',
      data: {
        id: 'root',
        topic: 'Main Node',
        interest: '0.1',
        distribution: '0.03',
        investment: '15000',
        description: 'Muster muster muster...'
      }
    },
    getMind(source, calc?: CalcProvider, opts?: MindMapModuleOpts, trans?: TranslateService, user?: IUser) {
      return getBasicMind(source, 'nodeTree', calc, opts);
    },
    getData(mind) {
      const df = customizeFormat.nodeTree;
      const json = { meta: {}, format: '', data: {} };
      json.meta = {
        name: mind.name,
        author: mind.author,
        version: mind.version
      };
      json.format = 'nodeTree';
      json.data = df._buildNode(mind.root);
      return json;
    },

    _parse(mind, nodeRoot, calc: CalcProvider) {
      const df = customizeFormat.nodeTree;
      const data = df._extractData(nodeRoot);

      mind.setRoot(
        nodeRoot.id,
        nodeRoot.topic,
        data,
        nodeRoot.interest,
        nodeRoot.investment,
        nodeRoot.distribution,
        nodeRoot.description,
        nodeRoot.active,
        nodeRoot.logo,
        nodeRoot.logoContentType,
        nodeRoot.income,
        nodeRoot.outgoing,
        nodeRoot.donations
      );
      if ('children' in nodeRoot) {
        const children = nodeRoot.children;
        for (let i = 0; i < children.length; i++) {
          df._extractSubNode(mind, mind.root, children[i], calc);
        }
      }
    },

    _extractData(nodeJson) {
      const data = {};
      for (const k in nodeJson) {
        if (
          k === 'id' ||
          k === 'topic' ||
          k === 'interest' ||
          k === 'distribution' ||
          k === 'investment' ||
          k === 'children' ||
          k === 'direction' ||
          k === 'expanded' ||
          k === 'selectedType' ||
          k === 'description' ||
          k === 'active' ||
          k === 'logo' ||
          k === 'logoContentType' ||
          k === 'income' ||
          k === 'outgoing' ||
          k === 'donations'
        ) {
          continue;
        }
        if (k === 'backgroundColor') {
          data['background-color'] = nodeJson[k];
        } else {
          data[k] = nodeJson[k];
        }
      }
      return data;
    },

    _extractSubNode(mind, nodeParent, nodeJson, calc: CalcProvider) {
      const df = customizeFormat.nodeTree;
      const data = df._extractData(nodeJson);
      let d = null;
      if (nodeParent != null && nodeParent.isroot) {
        d = nodeJson.direction === 'left' ? MindMapMain.direction.left : MindMapMain.direction.right;
      }
      const node = mind.addNode(
        nodeParent,
        nodeJson.id,
        nodeJson.topic,
        data,
        null,
        d,
        nodeJson.expanded,
        nodeJson.selectedType,
        null,
        customizeFormat.config.selectable,
        nodeJson.interest,
        nodeJson.investment,
        nodeJson.distribution,
        nodeJson.description,
        nodeJson.active,
        nodeJson.logo,
        nodeJson.logoContentType,
        nodeJson.income,
        nodeJson.outgoing,
        nodeJson.donations,
      );

      if ('children' in nodeJson) {
        const children = nodeJson.children;
        for (let i = 0; i < children.length; i++) {
          df._extractSubNode(mind, node, children[i], calc);
        }
      }
    },

    _buildNode(node) {
      const df = customizeFormat.nodeTree;
      if (!(node instanceof MindMapNode)) {
        return;
      }
      const o = {
        id: node.id,
        topic: node.topic,
        interest: node.interest,
        distribution: node.distribution,
        investment: node.investment,
        direction: '',
        children: [],
        selectedType: node.selectedType,
        isCreated: node.isCreated,
        isroot: node.isroot,
        expanded: node.expanded
      };
      if (node.parent && node.parent.isroot) {
        o.direction = node.direction === MindMapMain.direction.left ? 'left' : 'right';
      }
      if (node.data != null) {
        const nodeData = node.data;
        for (const k in nodeData) {
          if (k) o[k] = nodeData[k];
        }
      }
      const children = node.children;
      if (children.length > 0) {
        o.children = [];
        for (let i = 0; i < children.length; i++) {
          o.children.push(df._buildNode(children[i]));
        }
      }
      return o;
    }
  },

  nodeArray: {
    example: {
      meta: {
        name: NAME,
        author: AUTHOR,
        version: VERSION
      },
      format: 'nodeArray',
      data: [{ id: 'root', topic: 'Main Node', isroot: true }]
    },

    getMind(source, calc: CalcProvider, opts: MindMapModuleOpts) {
      return getBasicMind(source, 'nodeArray', calc, opts);
    },

    getData(mind) {
      const df = customizeFormat.nodeArray;
      const json = {
        meta: {},
        format: '',
        data: []
      };
      json.meta = {
        name: mind.name,
        author: mind.author,
        version: mind.version
      };
      json.format = 'nodeArray';
      json.data = [];
      df._array(mind, json.data);
      return json;
    },

    _parse(mind, nodeArray) {
      const df = customizeFormat.nodeArray;
      const narray = nodeArray.slice(0);
      // reverse array for improving looping performance
      narray.reverse();
      const rootId = df._extractRoot(mind, narray);
      if (rootId) {
        df._extractSubNode(mind, rootId, narray);
      } else {
        logger.error('root node can not be found');
      }
    },

    _extractRoot(mind, nodeArray) {
      const df = customizeFormat.nodeArray;
      let i = nodeArray.length;
      while (i--) {
        if ('isroot' in nodeArray[i] && nodeArray[i].isroot) {
          const rootJson = nodeArray[i];
          const data = df._extractData(rootJson);
          mind.setRoot(rootJson.id, rootJson.topic, data, rootJson.interest, rootJson.distribution);
          nodeArray.splice(i, 1);
          return rootJson.id;
        }
      }
      return null;
    },

    _extractSubNode(mind, parentid, nodeArray) {
      const df = customizeFormat.nodeArray;
      let i = nodeArray.length;
      let nodeJson = null;
      let data = null;
      let extractCount = 0;
      while (i--) {
        nodeJson = nodeArray[i];
        if (nodeJson.parentid === parentid) {
          data = df._extractData(nodeJson);
          let d = null;
          const nodeDirection = nodeJson.direction;
          if (nodeDirection) {
            d = nodeDirection === 'left' ? MindMapMain.direction.left : MindMapMain.direction.right;
          }
          mind.addNode(
            parentid,
            nodeJson.id,
            nodeJson.topic,
            data,
            null,
            d,
            nodeJson.expanded,
            null,
            null,
            nodeJson.interest,
            nodeJson.investment,
            nodeJson.distribution
          );
          nodeArray.splice(i, 1);
          extractCount++;
          const subExtractCount = df._extractSubNode(mind, nodeJson.id, nodeArray);
          if (subExtractCount > 0) {
            // reset loop index after extract subordinate node
            i = nodeArray.length;
            extractCount += subExtractCount;
          }
        }
      }
      return extractCount;
    },

    _extractData(nodeJson) {
      const data = {};
      for (const k in nodeJson) {
        if (k === 'id' || k === 'topic' || k === 'parentid' || k === 'isroot' || k === 'direction' || k === 'expanded') {
          continue;
        }
        data[k] = nodeJson[k];
      }
      return data;
    },

    _array(mind, nodeArray) {
      const df = customizeFormat.nodeArray;
      df._arrayNode(mind.root, nodeArray);
    },

    _arrayNode(node, nodeArray) {
      const df = customizeFormat.nodeArray;
      if (!(node instanceof MindMapNode)) {
        return;
      }
      const o = {
        id: node.id,
        topic: node.topic,
        interest: node.interest,
        distribution: node.distribution,
        investment: node.investment,
        parentid: '',
        isroot: false,
        direction: '',
        expanded: node.expanded
      };
      if (node.parent) {
        o.parentid = node.parent.id;
      }
      if (node.isroot) {
        o.isroot = true;
      }
      if (node.parent && node.parent.isroot) {
        o.direction = node.direction === MindMapMain.direction.left ? 'left' : 'right';
      }
      if (node.data != null) {
        const nodeData = node.data;
        for (const k in nodeData) {
          if (k) o[k] = nodeData[k];
        }
      }
      nodeArray.push(o);
      const ci = node.children.length;
      for (let i = 0; i < ci; i++) {
        df._arrayNode(node.children[i], nodeArray);
      }
    }
  },

  freemind: {
    example: {
      meta: {
        name: NAME,
        author: AUTHOR,
        version: VERSION
      },
      format: 'freemind',
      data: '<map version="1.0.1"><node ID="root" TEXT="freemind Example"/></map>'
    },
    getMind(source, calc: CalcProvider) {
      const df = customizeFormat.freemind;
      const mind = new MindMapMind(calc);
      mind.name = _.get(source, 'meta.name', NAME);
      mind.author = _.get(source, 'meta.author', AUTHOR);
      mind.version = _.get(source, 'meta.version', VERSION);
      const xml = source.data;
      const xmlDoc = df._parseXml(xml);
      const xmlRoot = df._findRoot(xmlDoc);
      df._loadNode(mind, null, xmlRoot);
      return mind;
    },

    getData(mind) {
      const df = customizeFormat.freemind;
      const json = { meta: {}, format: '', data: '' };
      json.meta = {
        name: mind.name,
        author: mind.author,
        version: mind.version
      };
      json.format = 'freemind';
      const xmllines = [];
      xmllines.push('<map version="1.0.1">');
      df._buildMap(mind.root, xmllines);
      xmllines.push('</map>');
      json.data = xmllines.join(' ');
      return json;
    },

    _parseXml(xml) {
      let xmlDoc = null;
      if ($win.DOMParser) {
        const parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, 'text/xml');
      } else {
        // Internet Explorer
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = false;
        xmlDoc.loadXML(xml);
      }
      return xmlDoc;
    },

    _findRoot(xmlDoc) {
      const nodes = xmlDoc.childNodes;
      let node = null;
      let n = null;
      for (let i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (n.nodeType === 1 && n.tagName === 'map') {
          node = n;
          break;
        }
      }
      if (node) {
        const ns = node.childNodes;
        node = null;
        for (let i = 0; i < ns.length; i++) {
          n = ns[i];
          if (n.nodeType === 1 && n.tagName === 'node') {
            node = n;
            break;
          }
        }
      }
      return node;
    },

    _loadNode(mind, parentId, xmlNode) {
      const df = customizeFormat.freemind;
      const nodeId = xmlNode.getAttribute('ID');
      let nodeTopic = xmlNode.getAttribute('TEXT');
      const nodeInterest = xmlNode.getAttribute('INTEREST');
      const nodeDistribution = xmlNode.getAttribute('DISTRIBUTION');
      const nodeInvestment = xmlNode.getAttribute('INVESTMENT');
      // look for richcontent
      if (nodeTopic == null) {
        const topicChildren = xmlNode.childNodes;
        let topicChild = null;
        for (let i = 0; i < topicChildren.length; i++) {
          topicChild = topicChildren[i];
          // logger.debug(topic_child.tagName);
          if (topicChild.nodeType === 1 && topicChild.tagName === 'richcontent') {
            nodeTopic = topicChild.textContent;
            break;
          }
        }
      }
      const nodeData: { expanded?: string } = df._loadAttributes(xmlNode);
      const nodeExpanded = 'expanded' in nodeData ? nodeData.expanded === 'true' : true;
      delete nodeData.expanded;

      const nodePosition = xmlNode.getAttribute('POSITION');
      let nodeDirection = null;
      if (nodePosition) {
        nodeDirection = nodePosition === 'left' ? MindMapMain.direction.left : MindMapMain.direction.right;
      }
      // logger.debug(node_position +':'+ nodeDirection);
      if (parentId) {
        mind.addNode(
          parentId,
          nodeId,
          nodeTopic,
          nodeData,
          null,
          nodeDirection,
          nodeExpanded,
          null,
          null,
          nodeInterest,
          nodeInvestment,
          nodeDistribution
        );
      } else {
        mind.setRoot(nodeId, nodeTopic, nodeData, nodeInterest, nodeDistribution);
      }
      const children = xmlNode.childNodes;
      let child = null;
      for (let i = 0; i < children.length; i++) {
        child = children[i];
        if (child.nodeType === 1 && child.tagName === 'node') {
          df._loadNode(mind, nodeId, child);
        }
      }
    },

    _loadAttributes(xmlNode) {
      const children = xmlNode.childNodes;
      let attr = null;
      const attrData = {};
      for (let i = 0; i < children.length; i++) {
        attr = children[i];
        if (attr.nodeType === 1 && attr.tagName === 'attribute') {
          attrData[attr.getAttribute('NAME')] = attr.getAttribute('VALUE');
        }
      }
      return attrData;
    },

    _buildMap(node, xmllines) {
      const df = customizeFormat.freemind;
      let pos = null;
      if (node.parent && node.parent.isroot) {
        pos = node.direction === MindMapMain.direction.left ? 'left' : 'right';
      }
      xmllines.push('<node');
      xmllines.push('ID="' + node.id + '"');
      if (pos) {
        xmllines.push('POSITION="' + pos + '"');
      }
      xmllines.push('INTEREST="' + node.interest + '"');
      xmllines.push('DISTRIBUTION="' + node.distribution + '"');
      xmllines.push('INVESTMENT="' + node.investment + '"');

      xmllines.push('TEXT="' + node.topic + '">');

      // store expanded status as an attribute
      xmllines.push('<attribute NAME="expanded" VALUE="' + node.expanded + '"/>');

      // for attributes
      const nodeData = node.data;
      if (nodeData != null) {
        for (const k in nodeData) {
          if (k) xmllines.push('<attribute NAME="' + k + '" VALUE="' + nodeData[k] + '"/>');
        }
      }

      // for children
      const children = node.children;
      for (let i = 0; i < children.length; i++) {
        df._buildMap(children[i], xmllines);
      }

      xmllines.push('</node>');
    }
  }
};
