import * as _ from 'lodash';
import { customizeUtil } from './util';
import { ShortcutProvider } from './shortcut-provider';
import { $win, DEFAULT_OPTIONS, logger, VERSION } from './config';
import { MindMapDataProvider } from './data-provider';
import { LayoutProvider } from './layout-provider';
import { customizeFormat } from './customize-format';
import { ViewProvider } from './view-provider';
import { Subject } from 'rxjs';
import { Draggable } from './plugin/draggable';
import { CalcProvider } from './mind-map-calc';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IncomeService } from 'app/entities/income/service/income.service';
import { OutgoingsService } from 'app/entities/outgoings/service/outgoings.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ServiceLocator } from 'app/locale.service';
import { IUser } from 'app/entities/user/user.model';


export interface MindMapModuleOptsView {
  hmargin: number;
  vmargin: number;
  lineWidth: number;
  lineColor: string;
}

export interface MindMapModuleOptsDefaultEventHandle {
  canHandleMouseDown: boolean;
  canHandleClick: boolean;
  canHandleDblclick: boolean;
}

export interface MindMapModuleOpts {
  container?: string;
  mode?: any;
  layout?: any;
  supportHtml?: any;
  view?: MindMapModuleOptsView;
  shortcut?: any;
  editable?: boolean;
  selectable?: boolean;
  defaultEventHandle?: MindMapModuleOptsDefaultEventHandle;
  theme?: any;
  depth?: number;
  canRootNodeEditable?: boolean;
  hasInteraction?: boolean;
  hierarchyRule?: { ROOT: any; [propName: string]: { name: string; getChildren: any } };
  enableDraggable?: boolean;
}

export class MindMapMain {
  static direction;
  static eventType;

  static plugin;
  static plugins;
  static registerPlugin;
  static initPluginsNextTick;
  static initPlugins;
  static show;

  version: string = VERSION;
  opts: MindMapModuleOpts = {};
  options = this.opts;
  inited = false;
  mind: any;
  eventHandles = [];
  data: MindMapDataProvider;
  layout: LayoutProvider;
  view: ViewProvider;
  calc: CalcProvider;
  shortcut;
  mindMapDataTransporter = new Subject<any>();
  mindMapDataReceiver = new Subject<any>();
  nodes: any;

  ideaService: IdeaService;
  incomeService: IncomeService;
  outgoingsService: OutgoingsService;
  translateService: TranslateService = ServiceLocator.injector.get(TranslateService);
  user: IUser;

  constructor(options) {
    customizeUtil.json.merge(this.opts, DEFAULT_OPTIONS);
    customizeUtil.json.merge(this.opts, options);
    if (this.opts.container === null || this.opts.container.length === 0) {
      logger.error('the options.container should not be empty.');
      return;
    }

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.show(this.mind);
    });

    this.init();
  }

  init() {
    if (this.inited) {
      return;
    }
    this.inited = true;

    const opts = this.options;

    const optsLayout = {
      mode: opts.mode,
      hspace: opts.layout.hspace,
      vspace: opts.layout.vspace,
      pspace: opts.layout.pspace
    };
    const optsView = {
      container: opts.container,
      supportHtml: opts.supportHtml,
      hmargin: opts.view.hmargin,
      vmargin: opts.view.vmargin,
      lineWidth: opts.view.lineWidth,
      lineColor: opts.view.lineColor
    };
    // create instance of function provider
    this.calc = new CalcProvider(this);
    this.data = new MindMapDataProvider(this, this.calc, this.translateService);
    this.layout = new LayoutProvider(this, optsLayout);
    this.view = new ViewProvider(this, optsView, this.calc);
    this.shortcut = new ShortcutProvider(this, opts.shortcut);

    this.data.init();
    this.layout.init();
    this.view.init();
    this.shortcut.init();

    this.eventBind();

    MindMapMain.initPluginsNextTick(this);
    if (this.options.enableDraggable) {
      this.options.enableDraggable = false;
      this.registerPlugin();
    }
  }

  registerPlugin() {
    const draggablePlugin = new MindMapMain.plugin('draggable', function(jm) {
      const jd = new Draggable(jm);
      jd.init();
      jm.addEventListener(function(type, data) {
       // jd.jmEventHandle.call(jd, type, data);
      });
    });

    MindMapMain.registerPlugin(draggablePlugin);
  }

  enableEdit() {
    this.options.editable = true;
  }

  disableEdit() {
    this.options.editable = false;
  }

  // call enableEventHandle('dblclick')
  // options are 'mousedown', 'click', 'dblclick'
  enableEventHandle(eventHandle) {
    this.options.defaultEventHandle['can' + eventHandle + 'Handle'] = true;
  }

  // call disableEventHandle('dblclick')
  // options are 'mousedown', 'click', 'dblclick'
  disableEventHandle(eventHandle) {
    this.options.defaultEventHandle['can' + eventHandle + 'Handle'] = false;
  }

  getEditable() {
    return this.options.editable;
  }

  getNodeEditable(node) {
    return !(!this.options.canRootNodeEditable && node.isroot);
  }

  setTheme(theme) {
    const themeOld = this.options.theme;
    this.options.theme = theme ? !!theme : !!null;
    if (themeOld !== this.options.theme) {
      this.view.resetTheme();
      this.view.resetCustomStyle();
    }
  }

  eventBind() {
    this.view.addEvent(this, 'mousedown', this.mouseDownHandle);
    this.view.addEvent(this, 'click', this.clickHandle);
    this.view.addEvent(this, 'dblclick', this.dblclickHandle);
  }

  mouseDownHandle(e) {
    if (!this.options.defaultEventHandle.canHandleMouseDown) {
      return;
    }
    const element = e.target || event.srcElement;
    const nodeid = this.view.getBindedNodeId(element);
    if (nodeid) {
      this.selectNode(nodeid);
    } else {
      this.selectClear();
    }
  }

  clickHandle(e) {
    if (!this.options.defaultEventHandle.canHandleClick) {
      return;
    }
    const element = e.target || event.srcElement;
    const isexpander = this.view.isExpander(element);
    if (isexpander) {
      const nodeid = this.view.getBindedNodeId(element);
      if (nodeid) {
        this.toggleNode(nodeid);
      }
    }
  }

  dblclickHandle(e) {
    if (!this.options.defaultEventHandle.canHandleDblclick) {
      return;
    }
    if (this.getEditable()) {
      const element = e.target || event.srcElement;
      const nodeid = this.view.getBindedNodeId(element);
      if (nodeid && nodeid !== 'root') {
        this.beginEdit(nodeid);
      }
    }
  }

  getSelectTypesByHierarchyRule(node?) {
    if (!this.options.hierarchyRule) {
      return null;
    }
    const types = [];
    types.push(_.get(node, 'selectedType'));
    const parentSelectType = _.get(node, 'parent.selectedType');
    let currentRule = _.find(this.options.hierarchyRule, { name: parentSelectType });
    if (!currentRule) {
      currentRule = this.options.hierarchyRule.ROOT;
    }
    currentRule.getChildren().forEach(children => {
      types.push(children.name);
    });
    return _.compact(types);
  }

  async calculateAll() {
    await this.calc.calculateDailyBalance();
    await this.calc.calculateProfitFromNodes();
    await this.calc.calculateProfitToSpend();
    await this.calc.calculateNetProfit();
    await this.calc.calculateCollection();
  }

  getParent(node) {
    let parents = [];
    parents = this.calc.getAllParents(node);
    parents.forEach(parent => {
      console.log(parent);
    });
  }

  beginEdit(node) {
    if (!customizeUtil.isNode(node)) {
      return this.beginEdit(this.getNode(node));
    }
    if (this.getEditable() && this.getNodeEditable(node)) {
      if (node) {
        this.view.editNodeBegin(node, this.getSelectTypesByHierarchyRule(node));
      } else {
        logger.error('the node can not be found');
      }
    } else {
      logger.error('fail, this mind map is not editable.');
      return;
    }
  }

  endEdit() {
    this.view.editNodeEnd();
  }

  toggleNode(node) {
    if (!customizeUtil.isNode(node)) {
      return this.toggleNode(this.getNode(node));
    }
    if (node) {
      if (node.isroot) {
        return;
      }
      this.view.saveLocation(node);
      this.layout.toggleNode(node);
      this.view.relayout();
      this.view.restoreLocation(node);
    } else {
      logger.error('the node can not be found.');
    }
  }

  expandNode(node) {
    if (!customizeUtil.isNode(node)) {
      return this.expandNode(this.getNode(node));
    }
    if (node) {
      if (node.isroot) {
        return;
      }
      this.view.saveLocation(node);
      this.layout.expandNode(node);
      this.view.relayout();
      this.view.restoreLocation(node);
    } else {
      logger.error('the node can not be found.');
    }
  }

  collapseNode(node) {
    if (!customizeUtil.isNode(node)) {
      return this.collapseNode(this.getNode(node));
    }
    if (node) {
      if (node.isroot) {
        return;
      }
      this.view.saveLocation(node);
      this.layout.collapseNode(node);
      this.view.relayout();
      this.view.restoreLocation(node);
    } else {
      logger.error('the node can not be found.');
    }
  }

  expandAll() {
    this.layout.expandAll();
    this.view.relayout();
  }

  collapseAll() {
    this.layout.collapseAll();
    this.view.relayout();
  }

  expandToDepth(depth) {
    this.layout.expandToDepth(depth);
    this.view.relayout();
  }

  _reset() {
    this.view.reset();
    this.layout.reset();
    this.data.reset();
  }

  _show(mind) {
    this.view
      .load()
      .then(() => {
        logger.debug('view.load ok');
      })
      .then(() => {
        this.layout.layout();
        logger.debug('layout.layout ok');
      })
      .then(() => {
        this.view.show(true);
        logger.debug('view.show ok');
      });
    this.invokeEventHandleNextTick(MindMapMain.eventType.show, { data: [mind] });
  }

  // show entrance
  show(mind) {
    this._reset();
    this._show(mind);
  }

  fetchData(mind): Promise<any> {
    return new Promise<any>(resolve => {
      const m = mind || customizeFormat.nodeArray.example;
      this.data.load(m, this.opts, this.calc).then(value => {
        this.mind = value;
        if (!this.mind) {
          logger.error('data.load error');
          return;
        } else {
          logger.debug('data.load ok');
        }
        resolve(this.mind);
      });
    });
  }

  getMeta() {
    return {
      name: this.mind.name,
      author: this.mind.author,
      version: this.mind.version
    };
  }

  getData(dataFormat?) {
    const df = dataFormat || 'nodeTree';
    return this.data.getData(df);
  }

  getDepth() {
    const currentData = this.getData().data;
    const getDepth = data => {
      const depth = 1;
      if (data.children && data.children[0]) {
        const childrenDepth = [];
        const childrenLength = data.children.length;
        for (let i = 0; i < childrenLength; i++) {
          childrenDepth.push(getDepth(data.children[i]));
        }
        return depth + _.max(childrenDepth);
      }
      return depth;
    };
    return getDepth(currentData);
  }

  getNode(nodeid) {
    return this.mind.getNode(nodeid);
  }

  getCurrentHierarchyRule(parentNode) {
    if (!this.options.hierarchyRule) {
      return null;
    }
    if (parentNode.isroot) {
      return this.options.hierarchyRule.ROOT.getChildren()[0];
    }
    return _.find(this.options.hierarchyRule, { name: parentNode.selectedType }).getChildren()[0];
  }

  addNode(parentNode, nodeid, topic, data, idx, direction?, expanded?, selectedType?, selectable?, interest?, investment?, distribution?, donations?) {
    data = data || {};
    data.isCreated = true;
    if (this.options.depth && parentNode.level >= this.options.depth) {
      throw new Error('over depth');
    }
    if (this.getEditable()) {
      const currentRule = this.getCurrentHierarchyRule(parentNode);
      const selType = currentRule && currentRule.name;
      if (!selType && this.options.hierarchyRule) {
        throw new Error('forbidden add');
      } else {
        topic = topic || `${selType}select`;
      }
      if (currentRule.backgroundColor) {
        data['background-color'] = currentRule.backgroundColor;
      }
      if (currentRule.color) {
        data['color'] = currentRule.color;
      }
      const node = this.mind.addNode(
        parentNode,
        nodeid,
        topic,
        data,
        null,
        null,
        null,
        selType,
        this.options.selectable,
        interest,
        investment,
        distribution,
        donations
      );
      if (node) {
        this.view.addNode(node);
        this.layout.layout();
        this.view.show(false);
        this.view.resetNodeCustomStyle(node);
        this.expandNode(parentNode);
        this.invokeEventHandleNextTick(MindMapMain.eventType.edit, {
          evt: 'addNode',
          data: [parentNode.id, nodeid, topic, data],
          node: nodeid
        });
      }
      return node;
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  insertNodeBefore(nodeBefor, nodeid, topic, data) {
    if (this.getEditable()) {
      const beforeid = customizeUtil.isNode(nodeBefor) ? nodeBefor.id : nodeBefor;
      const node = this.mind.insertNodeBefore(nodeBefor, nodeid, topic, data);
      if (node) {
        this.view.addNode(node);
        this.layout.layout();
        this.view.show(false);
        this.invokeEventHandleNextTick(MindMapMain.eventType.edit, {
          evt: 'insertNodeBefore',
          data: [beforeid, nodeid, topic, data],
          node: nodeid
        });
      }
      return node;
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  insertNodeAfter(nodeAfter, nodeid, topic, data) {
    if (this.getEditable()) {
      const node = this.mind.insertNodeAfter(nodeAfter, nodeid, topic, data);
      if (node) {
        this.view.addNode(node);
        this.layout.layout();
        this.view.show(false);
        this.invokeEventHandleNextTick(MindMapMain.eventType.edit, {
          evt: 'insertNodeAfter',
          data: [nodeAfter.id, nodeid, topic, data],
          node: nodeid
        });
      }
      return node;
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  removeNode(node) {
    if (!customizeUtil.isNode(node)) {
      return this.removeNode(this.getNode(node));
    }
    if (this.getEditable()) {
      if (node) {
        if (node.isroot) {
          logger.error('fail, can not remove root node');
          return false;
        }
        const nodeid = node.id;
        const parentid = node.parent.id;
        const parentNode = this.getNode(parentid);
        this.view.saveLocation(parentNode);
        this.view.removeNode(node);
        this.mind.removeNode(node);
        this.layout.layout();
        this.view.show(false);
        this.view.restoreLocation(parentNode);
        this.invokeEventHandleNextTick(MindMapMain.eventType.edit, {
          evt: 'removeNode',
          data: [nodeid],
          node: parentid
        });
      } else {
        logger.error('fail, node can not be found');
        return false;
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return;
    }
  }

  updateNode(nodeid, topic, selectedType, interest?, investment?, distribution?) {
    if (this.getEditable()) {
      if (customizeUtil.text.isEmpty(topic)) {
        logger.warn('fail, topic can not be empty');
        return;
      }
      const node = this.getNode(nodeid);
      if (node) {
        if (
          node.distribution === distribution &&
          node.interest === interest &&
          node.topic === topic &&
          node.investment === investment &&
          node.selectedType === selectedType
        ) {
          logger.info('nothing changed');
          this.view.updateNode(node);
          return;
        }
        node.topic = topic;
        node.interest = interest;
        node.distribution = distribution;
        node.investment = investment;
        node.selectedType = selectedType;

        this.view.updateNode(node);
        this.layout.layout();
        this.view.show(false);
        this.invokeEventHandleNextTick(MindMapMain.eventType.edit, {
          evt: 'updateNode',
          data: [nodeid, topic, null, interest, investment, distribution],
          node: nodeid
        });
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return;
    }
  }

  moveNode(nodeid, beforeid, parentid, direction) {
    if (this.getEditable()) {
      const node = this.mind.moveNode(nodeid, beforeid, parentid, direction);
      if (node) {
        this.view.updateNode(node);
        this.layout.layout();
        this.view.show(false);
        this.invokeEventHandleNextTick(MindMapMain.eventType.edit, {
          evt: 'moveNode',
          data: [nodeid, beforeid, parentid, direction],
          node: nodeid
        });
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return;
    }
  }

  selectNode(node) {
    if (!customizeUtil.isNode(node)) {
      return this.selectNode(this.getNode(node));
    }
    if (!node || !this.layout.isVisible(node)) {
      return;
    }
    this.mind.selected = node;
    if (node) {
      this.view.selectNode(node);
    }
  }

  getSelectedNode() {
    if (this.mind) {
      return this.mind.selected;
    } else {
      return null;
    }
  }

  selectClear() {
    if (this.mind) {
      this.mind.selected = null;
      this.view.selectClear();
    }
  }

  isNodeVisible(node) {
    return this.layout.isVisible(node);
  }

  findNodeBefore(node) {
    if (!customizeUtil.isNode(node)) {
      return this.findNodeBefore(this.getNode(node));
    }
    if (!node || node.isroot) {
      return null;
    }
    let n = null;
    if (node.parent.isroot) {
      const c = node.parent.children;
      let prev = null;
      let ni = null;
      for (let i = 0; i < c.length; i++) {
        ni = c[i];
        if (node.direction === ni.direction) {
          if (node.id === ni.id) {
            n = prev;
          }
          prev = ni;
        }
      }
    } else {
      n = this.mind.getNodeBefore(node);
    }
    return n;
  }

  findNodeAfter(node) {
    if (!customizeUtil.isNode(node)) {
      return this.findNodeAfter(this.getNode(node));
    }
    if (!node || node.isroot) {
      return null;
    }
    let n = null;
    if (node.parent.isroot) {
      const c = node.parent.children;
      let getthis = false;
      let ni = null;
      for (let i = 0; i < c.length; i++) {
        ni = c[i];
        if (node.direction === ni.direction) {
          if (getthis) {
            n = ni;
            break;
          }
          if (node.id === ni.id) {
            getthis = true;
          }
        }
      }
    } else {
      n = this.mind.getNodeAfter(node);
    }
    return n;
  }

  setNodeColor(nodeid, bgcolor, fgcolor) {
    if (this.getEditable()) {
      const node = this.mind.getNode(nodeid);
      if (node) {
        if (bgcolor) {
          node.data['background-color'] = bgcolor;
        }
        if (fgcolor) {
          node.data['foreground-color'] = fgcolor;
        }
        this.view.resetNodeCustomStyle(node);
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  setNodeFontStyle(nodeid, size, weight, style) {
    if (this.getEditable()) {
      const node = this.mind.getNode(nodeid);
      if (node) {
        if (size) {
          node.data['font-size'] = size;
        }
        if (weight) {
          node.data['font-weight'] = weight;
        }
        if (style) {
          node.data['font-style'] = style;
        }
        this.view.resetNodeCustomStyle(node);
        this.view.updateNode(node);
        this.layout.layout();
        this.view.show(false);
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  setNodeBackgroundImage(nodeid, image, width, height, rotation) {
    if (this.getEditable()) {
      const node = this.mind.getNode(nodeid);
      if (node) {
        if (image) {
          node.data['background-image'] = image;
        }
        if (width) {
          node.data['width'] = width;
        }
        if (height) {
          node.data['height'] = height;
        }
        if (rotation) {
          node.data['background-rotation'] = rotation;
        }
        this.view.resetNodeCustomStyle(node);
        this.view.updateNode(node);
        this.layout.layout();
        this.view.show(false);
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  setNodeBackgroundRotation(nodeid, rotation) {
    if (this.getEditable()) {
      const node = this.mind.getNode(nodeid);
      if (node) {
        if (!node.data['background-image']) {
          logger.error('fail, only can change rotation angle of node with background image');
          return null;
        }
        node.data['background-rotation'] = rotation;
        this.view.resetNodeCustomStyle(node);
        this.view.updateNode(node);
        this.layout.layout();
        this.view.show(false);
      }
    } else {
      logger.error('fail, this mind map is not editable');
      return null;
    }
  }

  zoomIn(): void {
    this.view.zoomIn();
  }

  zoomOut(): void {
    this.view.zoomOut();
  }

  resize() {
    this.view.resize();
  }

  // callback(type ,data)
  addEventListener(callback) {
    if (typeof callback === 'function') {
      this.eventHandles.push(callback);
    }
  }

  invokeEventHandleNextTick(type, data) {
    $win.setTimeout(() => {
      this.invokeEventHandle(type, data);
    }, 0);
  }

  invokeEventHandle(type, data) {
    const l = this.eventHandles.length;
    for (let i = 0; i < l; i++) {
      this.eventHandles[i](type, data);
    }
  }
}

MindMapMain.direction = { left: -1, center: 0, right: 1 };
MindMapMain.eventType = { show: 1, resize: 2, edit: 3, select: 4 };

/*
MindMapMain.plugin = (name, init) => {
  this.name = name;
  this.init = init;
};
*/

MindMapMain.plugins = [];

MindMapMain.registerPlugin = function(plugin) {
  if (plugin instanceof MindMapMain.plugin) {
    MindMapMain.plugins.push(plugin);
  }
};

MindMapMain.initPluginsNextTick = function(sender) {
  $win.setTimeout(function() {
    MindMapMain.initPlugins(sender);
  }, 0);
};

MindMapMain.initPlugins = function(sender) {
  const l = MindMapMain.plugins.length;
  let fnInit = null;
  for (let i = 0; i < l; i++) {
    fnInit = MindMapMain.plugins[i].init;
    if (typeof fnInit === 'function') {
      fnInit(sender);
    }
  }
};
