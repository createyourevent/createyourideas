
import { MindMapMain } from './mind-map-main';
import { ServiceLocator } from 'app/locale.service';
import { IIncome } from 'app/entities/income/income.model';
import { IOutgoings } from 'app/entities/outgoings/outgoings.model';
import { FinanceService } from 'app/finance.service';

export class CalcProvider {
  mindMap: MindMapMain;

  incomes: IIncome[];
  outgoings: IOutgoings[];

  financeService: FinanceService = ServiceLocator.injector.get(FinanceService);

  constructor(mindMap: MindMapMain) {
    this.mindMap = mindMap;
  }

  calculateProfit() {

  }

  calculateCollection() {
    return new Promise(resolve => {
      const root = this.mindMap.mind.root;
      const rootChildren = this.getChildren(root);
      const partNode = root.getProfitToSpend()/rootChildren.length;
      let i = 0;
      rootChildren.forEach(child => {
        child.setProfit(child.getProfit() + partNode);
        this.mindMap.view.updateNode(child);
        i++;
        if(i === rootChildren.length) {
          root.setProfitToSpend(0);
          this.mindMap.view.updateNode(root);
          resolve(true);
        }
      });
    });
  }

  calculateDailyBalance() {
    return new Promise(resolve => {
      this.financeService.getDailyBalance(Number(this.mindMap.mind.root.id)).subscribe(db => {
        this.mindMap.mind.root.dailyBalance = db.body;
        this.mindMap.view.updateNode(this.mindMap.mind.root);
      });
      const nodes = this.getChildren(this.mindMap.mind.root);
      let i = 0;
      nodes.forEach(node => {
        this.financeService.getDailyBalance(Number(node.id)).subscribe(db => {
          node.dailyBalance = db.body;
          this.mindMap.view.updateNode(node);
          i++;
          if(nodes.length === i)
            resolve(true);
        });
      });
    });
  }

  calculateProfitFromNodes() {
    return new Promise<boolean>(resolve => {
      const root = this.mindMap.mind.root;
      this.calculateProfitFromNode(root.id);
      const children = this.getChildren(root);
      let i = 0;
      children.forEach(child => {
        this.calculateProfitFromNode(child.id);
        i++;
        if(children.length === i)
          resolve(true);
      });
    });
  }

  calculateProfitFromNode(id: number) {
    const node = this.mindMap.mind.getNode(id);
    const children = this.getChildren(node);
    let profit = 0;
    children.forEach(child => {
      profit += (Number(node.interest) * child.dailyBalance);
    });
    node.setProfit(profit);
    this.mindMap.view.updateNode(node);
  }

  calculateProfitToSpend() {
    return new Promise<boolean>(resolve => {
      const root = this.mindMap.mind.root;
      root.setProfitToSpend(0.75*root.getProfit());
      this.mindMap.view.updateNode(root);
      const children = this.getChildren(root);
      let i = 0;
      children.forEach(child => {
        child.setProfitToSpend(0.75*child.getProfit());
        this.mindMap.view.updateNode(child);
        i++;
        if(children.length === i)
          resolve(true);
      });
    });
  }

  calculateNetProfit() {
    return new Promise<boolean>(resolve => {
      const root = this.mindMap.mind.root;
      const netRoot = root.getProfit()-root.getProfitToSpend();
      root.setNetProfit(netRoot);
      this.mindMap.view.updateNode(root);
      const children = this.getChildren(root);
      let i = 0;
      children.forEach(child => {
        const net = child.getProfit()-child.getProfitToSpend();
        child.setNetProfit(net);
        this.mindMap.view.updateNode(child);
        i++;
        if(children.length === i)
          resolve(true);
      });
    });
  }

  calculateDistribution() {
    return new Promise(resolve => {
      const lastChildren = this.getLastChildren();
      lastChildren.forEach(child => {
        child.profit += this.mindMap.mind.root.profit * this.mindMap.mind.root.distribution;
        this.mindMap.view.updateNode(child);
      });
      resolve(true);
    });
  }

  getLastChildren() {
    const root = this.mindMap.mind.root;
    const childrenFromRoot = this.getChildren(root);
    const lastChildren = [];
    childrenFromRoot.forEach(child => {
      if (child.children.length === 0) {
        lastChildren.push(child);
      }
    });
    return lastChildren;
  }

  getAllChildrenWithLevel(level, children) {
    const childrenWithLevel = [];
    children.forEach(child => {
      if(child.level === level) {
        childrenWithLevel.push(child);
      }
    });
    return childrenWithLevel;
  }

  getAllParents(node) {
    const parents = [];
    if(parent != null) {
      do {
        const parent = node.parent;
        parents.push(parent);
        node=parent;
        if(node.parent == null){
          break;
        }
      } while (node != null);
    }
    return parents;
  }

  getChildren(selectedNode) {
    const children = selectedNode.children;
    const nodes = [];
    children.forEach(child => {
      nodes.push(child);
    });
    nodes.concat(children);
    children.forEach(child => {
      nodes.concat(this._getChildren(child.children, nodes));
    });
    return nodes;
  }

  _getChildren(children, nodes?) {
    children.forEach(child => {
      if (child.children != null) {
        this._getChildren(child.children, nodes);
        nodes.push(child);
      }
    });
  }

  hasChildren(node) {
    if (node.children != null && node.children.length >= 1) {
      return true;
    } else {
      return false;
    }
  }
}
