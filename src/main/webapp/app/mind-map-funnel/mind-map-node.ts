import { IOutgoings } from './../entities/outgoings/outgoings.model';
import { logger } from './config';
import { FinanceService } from 'app/finance.service';
import { CurrencyPipe } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { IIncome } from 'app/entities/income/income.model';
import { TranslateService } from '@ngx-translate/core';
import { ServiceLocator } from 'app/locale.service';
import { AccountService } from 'app/core/auth/account.service';
import { Router } from '@angular/router';
import { GeneralService } from 'app/general.service';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { Component } from '@angular/core';

interface NodeData {
  view?: NodeView;
}

export interface NodeView {
  absX: string;
  absY: string;
  height: string;
  width: string;
}


export class MindMapNode {
  static compare;
  static inherited;

  id: string;
  index: any;
  topic: string;
  interest: number;
  distribution: number;
  investment: number;
  income: number;
  incomes: IIncome[];
  outgoings: IOutgoings[];
  donations: number;
  outgoing: number;
  selectedType: string;
  description: string;
  active: boolean;
  logo: Blob;
  logoContentType: string;
  data: { isCreated?: boolean };
  isroot: boolean;
  level: number;
  parent: MindMapNode;
  direction;
  expanded: boolean;
  children: Array<any>;
  isCreated: boolean;
  selectable: boolean;
  private _data: NodeData;
  financeService: FinanceService;
  cPipe: CurrencyPipe;
  pPipe: PercentPipe;
  translateService: TranslateService = ServiceLocator.injector.get(TranslateService);
  accountService: AccountService = ServiceLocator.injector.get(AccountService);
  generalService: GeneralService = ServiceLocator.injector.get(GeneralService);
  router: Router = ServiceLocator.injector.get(Router);
  ideaService: IdeaService = ServiceLocator.injector.get(IdeaService);
  _this: MindMapNode;

  constructor(
    sId,
    iIndex,
    sTopic,
    oData,
    sRoot,
    oParent?,
    eDirection?,
    bExpanded?,
    selectedType?,
    level?,
    selectable?,
    sInterest?,
    sInvestment?,
    sDistribution?,
    sDescription?,
    bActive?,
    logo?,
    logoContentType?,
    sIncome?,
    sOutgoing?,
    sDonations?,
    user?
  ) {
    if (!sId) {
      logger.error('invalid nodeid');
      return;
    }
    if (typeof iIndex !== 'number') {
      logger.error('invalid node index');
      return;
    }
    if (typeof bExpanded === 'undefined') {
      bExpanded = true;
    }
    this.id = sId;
    this.index = iIndex;
    this.topic = sTopic;
    this.interest = sInterest;
    this.distribution = sDistribution;
    this.investment = sInvestment;
    this.income = sIncome;
    this.outgoing = sOutgoing;
    this.donations = sDonations;
    this.selectedType = selectedType;
    this.description = sDescription;
    this.active = bActive;
    this.selectable = selectable;
    this.data = oData || {};
    this.isroot = sRoot;
    this.parent = oParent;
    this.direction = eDirection;
    this.expanded = !!bExpanded;
    this.level = level;
    this.children = [];
    this._data = {};
    this.isCreated = this.data.isCreated;
    if (this.isroot) {
      this.level = 1;
    }
    this.cPipe = new CurrencyPipe('de-CH');
    this.pPipe = new PercentPipe('en-US');
    this.logo = logo;
    this.logoContentType = logoContentType;
    this._this = this;
  }


  show() {
    let nodeView = '';
    if(this.accountService.isAuthenticated()) {
      nodeView =
      '<div>' +
      '<div class="row">' +
      '<div class="col-md-12">' +
      '<table id="balanceinfo-' +
      this.id +
      '" class="calcinfo">' +
      '<tr><td><span class="title-mindmap-funnel">' + this.translateService.instant('mind-map-node.idea') + ':</span></td><td>' +
      '<span class="title-mindmap-funnel"><a href="/ideas/' +
      this.id +
      '/view">' +
      this.topic +
      '</a></span>' +
      '</td></tr>' +
      '<tr><td colspan="2" style="text-align: center">' +
      '<img src="data:' +
      this.logoContentType +
      ';base64,' +
      this.logo +
      '" style="max-height: 150px;max-width: 250px;" alt="idea image"/>' +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.interest') + ':</span></td><td>' +
      this.pPipe.transform(this.interest) +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.distribution') + ':</span></td><td>' +
      this.pPipe.transform(this.distribution) +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.investment') + ':</span></td><td>' +
      this.cPipe.transform(this.investment, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.donations') + ':</span></td><td>' +
      this.cPipe.transform(this.donations, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.income') + ':</span></td><td>' +
      this.cPipe.transform(this.income, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.outgoing') + ':</span></td><td>' +
      this.cPipe.transform(this.outgoing, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '</table>' +
      '</div>' +
      '</div>' +
      '<hr/>' +
      '<table id="balanceprofit-' + this.id + '"></table>' +
      '<hr/>' +
      '<div class="row">' +
        '<div class="col-md-12">' +
          '<a class="donation" href="/ideas/' + this.id + '/donation">' + this.translateService.instant('mind-map-node.donation') + '</a>' +
          '<a class="donation width-100 float_link" href="/ideas/' + this.id + '/employees">' + this.translateService.instant('mind-map-node.employees') + '</a>' +
          '<a class="donation width-100 float_link" href="/ideas/' + this.id + '/application">' + this.translateService.instant('mind-map-node.application') + '</a>' +
        '</div>' +
      '</div>'
    }else {
      nodeView =
      '<div>' +
      '<div class="row">' +
      '<div class="col-md-12">' +
      '<table id="balanceinfo-' +
      this.id +
      '" class="calcinfo">' +
      '<tr><td><span class="title-mindmap-funnel">' + this.translateService.instant('mind-map-node.idea') + ':</span></td><td>' +
      '<span class="title-mindmap-funnel"><a href="/ideas/' +
      this.id +
      '/view">' +
      this.topic +
      '</a></span>' +
      '</td></tr>' +
      '<tr><td colspan="2" style="text-align: center">' +
      '<img src="data:' +
      this.logoContentType +
      ';base64,' +
      this.logo +
      '" style="max-height: 150px;max-width: 250px;" alt="idea image"/>' +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.interest') + ':</span></td><td>' +
      this.pPipe.transform(this.interest) +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.distribution') + ':</span></td><td>' +
      this.pPipe.transform(this.distribution) +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.investment') + ':</span></td><td>' +
      this.cPipe.transform(this.investment, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.donations') + ':</span></td><td>' +
      this.cPipe.transform(this.donations, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.income') + ':</span></td><td>' +
      this.cPipe.transform(this.income, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '<tr><td><span class="calcinfo-mindmap-funnel">' + this.translateService.instant('mind-map-node.outgoing') + ':</span></td><td>' +
      this.cPipe.transform(this.outgoing, 'CHF', undefined, undefined, 'de-CH') +
      '</td></tr>' +
      '</table>' +
      '</div>' +
      '<hr/>' +
      '<table id="balanceprofit-' + this.id + '"></table>' +
      '<hr/>' +
      '</div>'
    }

    return nodeView;
  }

  getLocation() {
    const vd = this._data.view;
    return {
      x: vd.absX,
      y: vd.absY
    };
  }

  getSize() {
    const vd = this._data.view;
    return {
      w: vd.width,
      h: vd.height
    };
  }
}

MindMapNode.compare = (node1, node2) => {
  let r;
  const i1 = node1.index;
  const i2 = node2.index;
  if (i1 >= 0 && i2 >= 0) {
    r = i1 - i2;
  } else if (i1 === -1 && i2 === -1) {
    r = 0;
  } else if (i1 === -1) {
    r = 1;
  } else if (i2 === -1) {
    r = -1;
  } else {
    r = 0;
  }
  return r;
};

MindMapNode.inherited = (pnode, node) => {
  if (pnode && node) {
    if (pnode.id === node.id) {
      return true;
    }
    if (pnode.isroot) {
      return true;
    }
    const pid = pnode.id;
    let p = node;
    while (!p.isroot) {
      p = p.parent;
      if (p.id === pid) {
        return true;
      }
    }
  }
  return false;
};
