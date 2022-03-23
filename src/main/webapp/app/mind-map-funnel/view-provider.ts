import { GeneralService } from './../general.service';
import * as _ from 'lodash';
import { $create, $document, $get, $html, $text, logger } from './config';
import { CalcProvider } from './mind-map-calc';
import { MindMapMain } from './mind-map-main';
import { customizeUtil } from './util';
import { ServiceLocator } from 'app/locale.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import * as $ from 'jquery';
import 'datatables.net';
import { from, Subject } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import dayjs from 'dayjs';

export class ViewProvider {
  opts: any;
  jm: any;
  layout: any;
  container = null;
  ePanel = null;
  eNodes = null;
  eCanvas = null;
  canvasCtx = null;
  size = { w: 0, h: 0 };
  selectedNode = null;
  selectedOptions;
  editingNode = null;
  previousNode = null;

  eEditor;
  eInterestEditor;
  eDistributionEditor;
  eInvestmentEditor;
  eSelect;
  currentSelect;
  actualZoom;
  zoomStep;
  minZoom;
  maxZoom;

  calc: CalcProvider;
  generalService: GeneralService = ServiceLocator.injector.get(GeneralService);
  cPipe: CurrencyPipe;
  dPipe: DatePipe;
  translateService: TranslateService = ServiceLocator.injector.get(TranslateService);

  constructor(jm, options, calc) {
    this.cPipe = new CurrencyPipe('de-CH');
    this.dPipe = new DatePipe('de-CH');

    this.opts = options;
    this.calc = calc;
    this.jm = jm;
    this.selectedOptions = this.jm.getSelectTypesByHierarchyRule();
    this.layout = jm.layout;

    this.jm.mindMapDataReceiver.subscribe(data => {
      this.editNodeEnd(data);
    });
  }

  static getSelectOption(value) {
    const eOption = $create('option');
    eOption.value = value;
    eOption.appendChild($document.createTextNode(value));
    return eOption;
  }

  init() {
    logger.debug('view.init');

    this.container = $get(this.opts.container);
    if (!this.container) {
      logger.error('the options.view.container was not be found in dom');
      return;
    }

    this.initView();
  }

  initView() {
    this.ePanel = $create('div');
    this.eCanvas = $create('canvas');
    this.eNodes = $create('jmnodes');

    this.eCanvas.className = 'jsmind-canvas';

    this.ePanel.className = 'jsmind-inner';
    this.ePanel.appendChild(this.eCanvas);
    this.ePanel.appendChild(this.eNodes);

    this.actualZoom = 1;
    this.zoomStep = 0.1;
    this.minZoom = 0.5;
    this.maxZoom = 2;

    this.addEventToCanvas();
    this.initSelect();
    this.initEditor();
    this.initInterestEditor();
    this.initDistributionEditor();
    this.initInvestmentEditor();

    this.container.appendChild(this.ePanel);
    this.canvasCtx = this.eCanvas.getContext('2d');
  }

  initSelect() {
    this.eSelect = $create('select');
    this.eSelect.value = this.selectedOptions && this.selectedOptions[0];
    if (this.selectedOptions) {
      this.selectedOptions.forEach(ele => {
        this.eSelect.appendChild(ViewProvider.getSelectOption(ele));
      });
    }

    this.addEventToSelect(this.eSelect);
  }

  initEditor() {
    this.eEditor = $create('input');
    this.eEditor.id = 'ideaEditor';
    this.eEditor.className = 'jsmind-editor';
    this.eEditor.type = 'text';
    this.addEventToEEditor(this.eEditor);
  }

  initInterestEditor() {
    this.eInterestEditor = $create('input');
    this.eInterestEditor.id = 'interestEditor';
    this.eInterestEditor.className = 'jsmind-editor';
    this.eInterestEditor.type = 'text';
    this.addEventToREditor(this.eInterestEditor);
  }

  initDistributionEditor() {
    this.eDistributionEditor = $create('input');
    this.eDistributionEditor.id = 'distributionEditor';
    this.eDistributionEditor.className = 'jsmind-editor';
    this.eDistributionEditor.type = 'text';
    this.addEventToDEditor(this.eDistributionEditor);
  }

  initInvestmentEditor() {
    this.eInvestmentEditor = $create('input');
    this.eInvestmentEditor.id = 'investmentEditor';
    this.eInvestmentEditor.className = 'jsmind-editor';
    this.eInvestmentEditor.type = 'text';
    this.addEventToPEditor(this.eInvestmentEditor);
  }

  addEventToCanvas() {
    customizeUtil.dom.addEvent(this.eNodes, 'click', e => {
      this.editNodeEnd();
      e.stopPropagation();
    });
  }

  addEventToEEditor(editor) {
    customizeUtil.dom.addEvent(editor, 'keydown', e => {
      const evt = e || event;
      if (evt.keyCode === 13) {
        this.editNodeEnd();
        evt.stopPropagation();
      }
    });
    customizeUtil.dom.addEvent(editor, 'blur', () => {
      setTimeout(() => {
        this.editNodeEnd();
      });
    });
    customizeUtil.dom.addEvent(editor, 'click', e => {
      const evt = e || event;
      evt.stopPropagation();
    });
    customizeUtil.dom.addEvent(editor, 'focus', e => {
      const evt = e || event;
      evt.stopPropagation();
      const type = this.editingNode.selectedType;
      if (this.getIsInteractSelectedValue(type)) {
        this.jm.mindMapDataTransporter.next({ type, topic: this.editingNode.topic });
      }
    });
  }

  addEventToPEditor(editor) {
    customizeUtil.dom.addEvent(editor, 'keydown', e => {
      const evt = e || event;
      if (evt.keyCode === 13) {
        this.editNodeEnd();
        evt.stopPropagation();
      }
    });
    customizeUtil.dom.addEvent(editor, 'blur', () => {
      setTimeout(() => {
        this.editNodeEnd();
      });
    });
    customizeUtil.dom.addEvent(editor, 'click', e => {
      const evt = e || event;
      evt.stopPropagation();
    });
    customizeUtil.dom.addEvent(editor, 'focus', e => {
      const evt = e || event;
      evt.stopPropagation();
      const type = this.editingNode.selectedType;
      if (this.getIsInteractSelectedValue(type)) {
        this.jm.mindMapDataTransporter.next({ type, investment: this.editingNode.investment });
      }
    });
  }

  addEventToDEditor(editor) {
    customizeUtil.dom.addEvent(editor, 'keydown', e => {
      const evt = e || event;
      if (evt.keyCode === 13) {
        this.editNodeEnd();
        evt.stopPropagation();
      }
    });
    customizeUtil.dom.addEvent(editor, 'blur', () => {
      setTimeout(() => {
        this.editNodeEnd();
      });
    });
    customizeUtil.dom.addEvent(editor, 'click', e => {
      const evt = e || event;
      evt.stopPropagation();
    });
    customizeUtil.dom.addEvent(editor, 'focus', e => {
      const evt = e || event;
      evt.stopPropagation();
      const type = this.editingNode.selectedType;
      if (this.getIsInteractSelectedValue(type)) {
        this.jm.mindMapDataTransporter.next({ type, distribution: this.editingNode.distribution });
      }
    });
  }

  addEventToREditor(editor) {
    customizeUtil.dom.addEvent(editor, 'keydown', e => {
      const evt = e || event;
      if (evt.keyCode === 13) {
        this.editNodeEnd();
        evt.stopPropagation();
      }
    });
    customizeUtil.dom.addEvent(editor, 'blur', () => {
      setTimeout(() => {
        this.editNodeEnd();
      });
    });
    customizeUtil.dom.addEvent(editor, 'click', e => {
      const evt = e || event;
      evt.stopPropagation();
    });
    customizeUtil.dom.addEvent(editor, 'focus', e => {
      const evt = e || event;
      evt.stopPropagation();
      const type = this.editingNode.selectedType;
      if (this.getIsInteractSelectedValue(type)) {
        this.jm.mindMapDataTransporter.next({ type, interest: this.editingNode.interest });
      }
    });
  }

  addEventToSelect(select) {
    customizeUtil.dom.addEvent(select, 'click', e => {
      const evt = e || event;
      evt.stopPropagation();
    });
    customizeUtil.dom.addEvent(select, 'change', e => {
      const evt = e || event;
      evt.stopPropagation();
      const value = _.get(evt, 'srcElement.value');
      if (this.getIsInteractSelectedValue(value)) {
        this.jm.mindMapDataTransporter.next(value);
      }
    });
  }

  getIsInteractSelectedValue(value) {
    return this.jm.options.hasInteraction && value === _.last(this.selectedOptions);
  }

  addEvent(obj, eventName, eventHandle) {
    customizeUtil.dom.addEvent(this.eNodes, eventName, function(e) {
      const evt = e || event;
      eventHandle.call(obj, evt);
    });
  }

  getBindedNodeId(element) {
    if (element == null) {
      return null;
    }
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'jmnodes' || tagName === 'body' || tagName === 'html') {
      return null;
    }
    if (tagName === 'jmnode' || tagName === 'jmexpander') {
      return element.getAttribute('nodeid');
    } else {
      return this.getBindedNodeId(element.parentElement);
    }
  }

  isExpander(element) {
    return element.tagName.toLowerCase() === 'jmexpander';
  }

  reset() {
    logger.debug('view.reset');
    this.selectedNode = null;
    this.clearLines();
    this.clearNodes();
    this.resetTheme();
  }

  resetTheme() {
    const themeName = this.jm.options.theme;
    if (themeName) {
      this.eNodes.className = 'theme-' + themeName;
    } else {
      this.eNodes.className = '';
    }
  }

  resetCustomStyle() {
    const nodes = this.jm.mind.nodes;
    for (const nodeid in nodes) {
      if (nodeid) this.resetNodeCustomStyle(nodes[nodeid]);
    }
  }

  load() {
    return new Promise(resolve => {
      logger.debug('view.load');
      this.initNodes().then(() => {
        resolve(true);
      });
    });
  }

  expandSize() {
    const minSize = this.layout.getMinSize();
    const minWidth = minSize.w + this.opts.hmargin * 2;
    const minHeight = minSize.h + this.opts.vmargin * 2;
    let clientW = this.ePanel.clientWidth;
    let clientH = this.ePanel.clientHeight;
    if (clientW < minWidth) {
      clientW = minWidth;
    }
    if (clientH < minHeight) {
      clientH = minHeight;
    }
    this.size.w = clientW;
    this.size.h = clientH;
  }

  initNodesSize(node, table?) {
    return new Promise(resolve => {
      const viewData = node._data.view;
      viewData.width = viewData.element.clientWidth;
      if (table) viewData.height = viewData.element.clientHeight + table/2;
      else viewData.height = viewData.element.clientHeight + 15;
      resolve(true);
    });
  }

  initNodes() {
    return new Promise(resolve => {
      const nodes = this.jm.mind.nodes;
      const docFrag = $document.createDocumentFragment();
      for (const nodeid in nodes) {
        if (nodeid) this.createNodeElement(nodes[nodeid], docFrag);
      }
      this.eNodes.appendChild(docFrag);
      for (const nodeid in nodes) {
        if (nodeid) this.initNodesSize(nodes[nodeid]);
      }
      resolve(true);
    });
  }

  addNode(node) {
    this.createNodeElement(node, this.eNodes);
    this.initNodesSize(node);
  }

  createNodeElement(node, parentNode) {
    let viewData = null;
    if ('view' in node._data) {
      viewData = node._data.view;
    } else {
      viewData = {};
      node._data.view = viewData;
    }

    const d = $create('jmnode');
    d.setAttribute('class', 'jmnode margin-top-bottom-10');
    d.setAttribute('id', 'jmnode-' + node.id);
    d.setAttribute('nodeid', node.id);
    d.style.visibility = 'hidden';
    if (node.isroot) {
      d.className = 'root';
    } else {
      const expander = $create('jmexpander');
      $text(expander, '-');
      expander.setAttribute('nodeid', node.id);
      expander.style.visibility = 'hidden';
      parentNode.appendChild(expander);
      viewData.expander = expander;
    }
    if (node.topic && node.interest && node.distribution && node.investment) {
      if (this.opts.supportHtml) {
        $html(d, node.show());
      } else {
        $text(d, node.show());
      }
    }
    this.calculateBalance(node);
    parentNode.appendChild(d);
    viewData.element = d;
    const self = this;
  }


  calculateBalance(node) {
    const t = this;
    this._loadBalance(node.id).then(value => {
      $('#balanceprofit-' + node.id).DataTable({
        initComplete() {
          t.initNodesSize(node, $('#balanceprofit-' + node.id).height()).then(() => {
            t.relayout();
            t.layout.layoutOffset();
          });
        },
        data: value,
        columns: [{ title: 'Date' }, { title: 'Daily Balance' }, { title: 'Net profit' }]
      });
    });
  }

  _loadBalance(id: number) {
    const dataset = [];
    return new Promise<any[]>(resolve => {
      this.generalService.queryBalanceByIdeaId(Number(id)).subscribe(res => {
        const balances = res.body;
        let i = 0;
        balances.forEach(b => {
          i++;
          dataset.push([this.dPipe.transform(dayjs(b.date).toDate(), 'medium'), this.cPipe.transform( b.dailyBalance, 'CHF', undefined, undefined, 'de-CH'), this.cPipe.transform(b.netProfit, 'CHF', undefined, undefined, 'de-CH')]);
          if (balances.length === i) {
            resolve(dataset);
          }
        });
      });
    });
  }



  removeNode(node) {
    if (this.selectedNode != null && this.selectedNode.id === node.id) {
      this.selectedNode = null;
    }
    if (this.editingNode != null && this.editingNode.id === node.id) {
      node._data.view.element.removeChild(this.eEditor);
      node._data.view.element.removeChild(this.eInterestEditor);
      node._data.view.element.removeChild(this.eInvestmentEditor);
      this.editingNode = null;
    }
    const children = node.children;
    let i = children.length;
    while (i--) {
      this.removeNode(children[i]);
    }
    if (node._data.view) {
      const element = node._data.view.element;
      const expander = node._data.view.expander;
      this.eNodes.removeChild(element);
      this.eNodes.removeChild(expander);
      node._data.view.element = null;
      node._data.view.expander = null;
    }
  }

  updateNode(node) {
    const viewData = node._data.view;
    const element = viewData.element;
    if (node.topic) {
      if (this.opts.supportHtml) {
        $html(element, node.show());
      } else {
        $text(element, node.show());
      }
    }
    if (node.interest) {
      if (this.opts.supportHtml) {
        $html(element, node.show());
      } else {
        $text(element, node.show());
      }
    }
    if (node.distribution) {
      if (this.opts.supportHtml) {
        $html(element, node.show());
      } else {
        $text(element, node.show());
      }
    }
    if (node.investment) {
      if (this.opts.supportHtml) {
        $html(element, node.show());
      } else {
        $text(element, node.show());
      }
    }
    viewData.width = element.clientWidth;
    viewData.height = element.clientHeight;
  }

  selectNode(node) {
    if (this.selectedNode) {
      this.selectedNode._data.view.element.className = this.selectedNode._data.view.element.className.replace(/\s*selected\s*/i, '');
      this.resetNodeCustomStyle(this.selectedNode);
    }
    if (node) {
      this.selectedNode = node;
      node._data.view.element.className += ' selected';
      this.clearNodeCustomStyle(node);
    }
  }

  selectClear() {
    this.selectNode(null);
  }

  getEditingNode() {
    return this.editingNode;
  }

  isEditing() {
    return !!this.editingNode;
  }

  createSelectByTypes(types) {
    const newSelect = $create('select');
    types.slice(1).forEach(type => {
      newSelect.appendChild(ViewProvider.getSelectOption(type));
    });
    if (types.length <= 1) {
      newSelect.style.borderColor = 'red';
    }
    this.addEventToSelect(newSelect);

    newSelect.value = types[0];
    return newSelect;
  }

  // when db click
  editNodeBegin(node, types) {
    if (!node.topic) {
      logger.warn(`don't edit image nodes`);
      return;
    }
    if (this.editingNode != null) {
      this.editNodeEnd();
    }
    this.editingNode = node;
    this.previousNode = node;
    const viewData = node._data.view;
    const element = viewData.element;
    const topic = node.topic;
    const interest = node.interest;
    const distribution = node.distribution;
    const investment = node.investment;
    const ncs = getComputedStyle(element);
    this.eEditor.value = topic;
    this.eInterestEditor.value = interest;
    this.eDistributionEditor.value = distribution;
    this.eInvestmentEditor.value = investment;
    this.eEditor.style.width =
      element.clientWidth - parseInt(ncs.getPropertyValue('padding-left'), 10) - parseInt(ncs.getPropertyValue('padding-right'), 10) + 'px';
    this.eInterestEditor.style.width =
      element.clientWidth - parseInt(ncs.getPropertyValue('padding-left'), 10) - parseInt(ncs.getPropertyValue('padding-right'), 10) + 'px';
    this.eDistributionEditor.style.width =
      element.clientWidth - parseInt(ncs.getPropertyValue('padding-left'), 10) - parseInt(ncs.getPropertyValue('padding-right'), 10) + 'px';
    this.eInvestmentEditor.style.width =
      element.clientWidth - parseInt(ncs.getPropertyValue('padding-left'), 10) - parseInt(ncs.getPropertyValue('padding-right'), 10) + 'px';

    element.innerHTML = '';
    if (types) {
      this.currentSelect = this.createSelectByTypes(types);
    } else {
      this.currentSelect = this.eSelect;
    }
    node.selectable && element.appendChild(this.currentSelect);

    const table = document.createElement('table');
    table.id = 'editors';
    const row1 = table.insertRow(0);
    const cell11 = row1.insertCell(0);
    const cell21 = row1.insertCell(1);
    cell11.innerHTML = 'Idea:';
    cell21.appendChild(this.eEditor);

    const row2 = table.insertRow(1);
    const cell12 = row2.insertCell(0);
    const cell22 = row2.insertCell(1);
    cell12.innerHTML = 'Interest:';
    cell22.appendChild(this.eInterestEditor);

    const row3 = table.insertRow(1);
    const cell13 = row3.insertCell(0);
    const cell23 = row3.insertCell(1);
    cell13.innerHTML = 'Distribution:';
    cell23.appendChild(this.eDistributionEditor);

    const row4 = table.insertRow(2);
    const cell14 = row4.insertCell(0);
    const cell24 = row4.insertCell(1);
    cell14.innerHTML = 'Investment:';
    cell24.appendChild(this.eInvestmentEditor);
    element.appendChild(table);
    element.style.zIndex = 5;

    // this.eEditor.focus();
    // this.eEditor.select();
  }

  editNodeEnd(value?) {
    const interest = this.eInterestEditor.value;
    const distribution = this.eDistributionEditor.value;
    const investment = this.eInvestmentEditor.value;
    const selectedType = this.currentSelect.value;
    if (this.editingNode != null) {
      const node = this.editingNode;
      const viewData = node._data.view;
      const element = viewData.element;
      if (value) {
        this.eEditor.value = value;
        this.eInterestEditor.value = value;
        this.eDistributionEditor = value;
        this.eInvestmentEditor.value = value;
      }
      const topic = this.eEditor.value;
      element.style.zIndex = 'auto';
      // element.removeChild(this.eEditor);
      const editors = document.getElementById('editors');
      element.removeChild(editors);
      node.selectable && element.removeChild(this.currentSelect);
      if (customizeUtil.text.isEmpty(topic)) {
        if (this.opts.supportHtml) {
          $html(element, node.show());
        } else {
          $text(element, node.show());
        }
      } else {
        this.jm.updateNode(node.id, topic, selectedType, interest, investment, distribution);
      }
      this.editingNode = null;
    } else if (value) {
      this.jm.updateNode(this.previousNode.id, value, this.previousNode.selectedType, interest, investment, distribution);
    }
  }

  getViewOffset() {
    const bounds = this.layout.bounds;
    const _x = (this.size.w - bounds.e - bounds.w) / 2;
    const _y = this.size.h / 2;
    return { x: _x, y: _y };
  }

  resize() {
    this.eCanvas.width = 1;
    this.eCanvas.height = 1;
    this.eNodes.style.width = '1px';
    this.eNodes.style.height = '1px';

    this.expandSize();
    this._show();
  }

  _show() {
    this.eCanvas.width = this.size.w;
    this.eCanvas.height = this.size.h;
    this.eNodes.style.width = this.size.w + 'px';
    this.eNodes.style.height = this.size.h + 'px';
    this.showNodes();
    this.showLines();
    // this.layout.cacheValid = true;
    this.jm.invokeEventHandleNextTick(MindMapMain.eventType.resize, { data: [] });
  }

  zoomIn() {
    return this.setZoom(this.actualZoom + this.zoomStep);
  }

  zoomOut() {
    return this.setZoom(this.actualZoom - this.zoomStep);
  }

  setZoom(zoom) {
    if (zoom < this.minZoom || zoom > this.maxZoom) {
      return false;
    }
    this.actualZoom = zoom;
    for (let i = 0; i < this.ePanel.children.length; i++) {
      this.ePanel.children[i].style.transform = 'scale(' + zoom + ')';
    }
    this.show(true);
    return true;
  }

  _centerRoot() {
    // center root node
    const outerW = this.ePanel.clientWidth;
    const outerH = this.ePanel.clientHeight;
    if (this.size.w > outerW) {
      const _offset = this.getViewOffset();
      this.ePanel.scrollLeft = _offset.x - outerW / 2;
    }
    if (this.size.h > outerH) {
      this.ePanel.scrollTop = (this.size.h - outerH) / 2;
    }
  }

  show(keepCenter) {
    logger.debug('view.show');
    this.expandSize();
    this._show();
    if (keepCenter) {
      this._centerRoot();
    }
  }

  relayout() {
    this.expandSize();
    this._show();
  }

  saveLocation(node) {
    const vd = node._data.view;
    vd._savedLocation = {
      x: parseInt(vd.element.style.left, 10) - this.ePanel.scrollLeft,
      y: parseInt(vd.element.style.top, 10) - this.ePanel.scrollTop
    };
  }

  restoreLocation(node) {
    const vd = node._data.view;
    this.ePanel.scrollLeft = parseInt(vd.element.style.left, 10) - vd._savedLocation.x;
    this.ePanel.scrollTop = parseInt(vd.element.style.top, 10) - vd._savedLocation.y;
  }

  clearNodes() {
    const mind = this.jm.mind;
    if (mind == null) {
      return;
    }
    const nodes = mind.nodes;
    let node = null;
    for (const nodeid in nodes) {
      if (nodeid) {
        node = nodes[nodeid];
        if (node._data.view) {
          node._data.view.element = null;
          node._data.view.expander = null;
        }
      }
    }
    this.eNodes.innerHTML = '';
  }

  showNodes() {
    const nodes = this.jm.mind.nodes;
    let node = null;
    let nodeElement = null;
    let operationArea = null;
    let expander = null;
    let p = null;
    let pExpander = null;
    let expanderText = '-';
    let viewData = null;
    const _offset = this.getViewOffset();
    for (const nodeid in nodes) {
      if (nodeid) {
        node = nodes[nodeid];
        viewData = node._data.view;
        nodeElement = viewData.element;
        operationArea = viewData.operationArea;
        expander = viewData.expander;
        if (!this.layout.isVisible(node)) {
          nodeElement.style.display = 'none';
          expander.style.display = 'none';
          continue;
        }
        this.resetNodeCustomStyle(node);
        p = this.layout.getNodePoint(node);
        viewData.absX = _offset.x + p.x;
        viewData.absY = _offset.y + p.y;
        nodeElement.style.left = _offset.x + p.x + 'px';
        nodeElement.style.top = _offset.y + p.y + 'px';
        nodeElement.style.display = '';
        nodeElement.style.visibility = 'visible';

        if (operationArea) {
          operationArea.style.left = _offset.x + p.x + 'px';
          operationArea.style.top = _offset.y + p.y + 43 + 'px';
        }
        if (!node.isroot && node.children.length > 0) {
          expanderText = node.expanded ? '-' : '+';
          pExpander = this.layout.getExpanderPoint(node);
          expander.style.left = _offset.x + pExpander.x + 'px';
          expander.style.top = _offset.y + pExpander.y + 'px';
          expander.style.display = '';
          expander.style.visibility = 'visible';
          $text(expander, expanderText);
        }

        // hide expander while all children have been removed
        if (!node.isroot && node.children.length === 0) {
          expander.style.display = 'none';
          expander.style.visibility = 'hidden';
        }
      }
    }
  }

  resetNodeCustomStyle(node) {
    this._resetNodeCustomStyle(node._data.view.element, node.data);
  }

  _resetNodeCustomStyle(nodeElement, nodeData) {
    if ('background-color' in nodeData) {
      nodeElement.style.backgroundColor = nodeData['background-color'];
    }
    if ('foreground-color' in nodeData) {
      nodeElement.style.color = nodeData['foreground-color'];
    }
    if ('width' in nodeData) {
      nodeElement.style.width = nodeData['width'] + 'px';
    }
    if ('height' in nodeData) {
      nodeElement.style.height = nodeData['height'] + 'px';
    }
    if ('font-size' in nodeData) {
      nodeElement.style.fontSize = nodeData['font-size'] + 'px';
    }
    if ('font-weight' in nodeData) {
      nodeElement.style.fontWeight = nodeData['font-weight'];
    }
    if ('font-style' in nodeData) {
      nodeElement.style.fontStyle = nodeData['font-style'];
    }
    if ('color' in nodeData) {
      nodeElement.style.color = nodeData['color'];
    }
    if ('background-image' in nodeData) {
      const backgroundImage = nodeData['background-image'];
      if (backgroundImage.startsWith('data') && nodeData['width'] && nodeData['height']) {
        const img = new Image();

        img.onload = function() {
          const c = $create('canvas');
          c.width = nodeElement.clientWidth;
          c.height = nodeElement.clientHeight;
          if (c.getContext) {
            const ctx = c.getContext('2d');
            ctx.drawImage(this, 2, 2, nodeElement.clientWidth, nodeElement.clientHeight);
            const scaledImageData = c.toDataURL();
            nodeElement.style.backgroundImage = 'url(' + scaledImageData + ')';
          }
        };
        img.src = backgroundImage;
      } else {
        nodeElement.style.backgroundImage = 'url(' + backgroundImage + ')';
      }
      nodeElement.style.backgroundSize = '99%';

      if ('background-rotation' in nodeData) {
        nodeElement.style.transform = 'rotate(' + nodeData['background-rotation'] + 'deg)';
      }
    }
  }

  clearNodeCustomStyle(node) {
    const nodeElement = node._data.view.element;
    nodeElement.style.backgroundColor = '';
    nodeElement.style.color = '';
  }

  clearLines(canvasCtx?) {
    const ctx = canvasCtx || this.canvasCtx;
    customizeUtil.canvas.clear(ctx, 0, 0, this.size.w, this.size.h);
  }

  showLines(canvasCtx?) {
    this.clearLines(canvasCtx);
    const nodes = this.jm.mind.nodes;
    let node = null;
    let pin = null;
    let pout = null;
    const _offset = this.getViewOffset();
    for (const nodeid in nodes) {
      if (nodeid) {
        node = nodes[nodeid];
        if (node.isroot) {
          continue;
        }
        if ('visible' in node._data.layout && !node._data.layout.visible) {
          continue;
        }
        pin = this.layout.getNodePointIn(node);
        pout = this.layout.getNodePointOut(node.parent);
        this.drawLine(pout, pin, _offset, canvasCtx);
      }
    }
    const root = this.jm.mind.root;
    const lastChildren = this.calc.getLastChildren();
    pout = this.layout.getNodePointIn(root);
    lastChildren.forEach(lastChild => {
      pin = this.layout.getNodePointOut(lastChild);
      this.drawBackLine(pout, pin, _offset, canvasCtx);
    });
  }

  drawLine(pin, pout, offset, canvasCtx) {
    const ctx = canvasCtx || this.canvasCtx;
    ctx.strokeStyle = this.opts.lineColor;
    ctx.lineWidth = this.opts.lineWidth;
    ctx.lineCap = 'round';

    customizeUtil.canvas.bezierto(ctx, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
  }

  drawBackLine(pin, pout, offset, canvasCtx) {
    const ctx = canvasCtx || this.canvasCtx;
    ctx.strokeStyle = '#D58CE8';
    ctx.lineWidth = this.opts.lineWidth;
    ctx.lineCap = 'round';

    customizeUtil.canvas.bezierto(ctx, pin.x + offset.x, pin.y + offset.y, pout.x + offset.x, pout.y + offset.y);
  }
}
