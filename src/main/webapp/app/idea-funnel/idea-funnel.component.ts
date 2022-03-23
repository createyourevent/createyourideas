import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { IdeaService } from "app/entities/idea/service/idea.service";
import { IncomeService } from "app/entities/income/service/income.service";
import { OutgoingsService } from "app/entities/outgoings/service/outgoings.service";
import { GeneralService } from "app/general.service";
import { MindMapMain, customizeUtil } from "app/mind-map-funnel";
import { MindMapMind } from "app/mind-map-funnel/mind-map-mind";
import { IdeaFunnelService } from "./idea-funnel.service";



const HIERARCHY_RULES = {
  ROOT: {
    name: 'ROOT§',
    backgroundColor: '#7EC6E1',
    getChildren: () => [HIERARCHY_RULES.LEVEL1]
  },
  LEVEL1: {
    name: 'LEVEL1',
    color: '#fff',
    backgroundColor: '#616161',
    getChildren: () => [HIERARCHY_RULES.LEVEL2]
  },
  LEVEL2: {
    name: 'LEVEL2',
    color: '#fff',
    backgroundColor: '#989898',
    getChildren: () => [HIERARCHY_RULES.LEVEL3]
  },
  LEVEL3: {
    name: 'LEVEL3',
    color: '#fff',
    backgroundColor: '#C6C6C6',
    getChildren: () => [HIERARCHY_RULES.LEVEL4]
  },
  LEVEL4: {
    name: 'LEVEL4',
    color: '#fff',
    backgroundColor: '#CC2EFA',
    getChildren: () => [HIERARCHY_RULES.LEVEL5]
  },
  LEVEL5: {
    name: 'LEVEL5',
    color: '#fff',
    backgroundColor: '#0B610B',
    getChildren: () => [HIERARCHY_RULES.LEVEL6]
  },
  LEVEL6: {
    name: 'LEVEL6',
    color: '#fff',
    backgroundColor: '#610B0B',
    getChildren: () => [HIERARCHY_RULES.LEVEL7]
  },
  LEVEL7: {
    name: 'LEVEL7',
    color: '#fff',
    backgroundColor: '#0B243B',
    getChildren: () => [HIERARCHY_RULES.LEVEL8]
  },
  LEVEL8: {
    name: 'LEVEL8',
    color: '#fff',
    backgroundColor: '#393B0B',
    getChildren: () => [HIERARCHY_RULES.LEVEL9]
  },
  LEVEL9: {
    name: 'LEVEL9',
    color: '#fff',
    backgroundColor: '#190707',
    getChildren: () => []
  }
};

const option = {
  container: 'jsmind_container',
  theme: 'primary',
  editable: false,
  depth: 10,
  // hierarchyRule: HIERARCHY_RULES,
  enableDraggable: false
};

@Component({
  selector: 'jhi-idea-funnel',
  templateUrl: './idea-funnel.component.html',
  styleUrls: ['./idea-funnel.component.scss']
})
export class IdeaFunnelComponent implements OnInit {
  title = 'Idea Funnel';
  mindMap;
  mind2: string;
  m: MindMapMind;

  constructor(
    protected ideaService: IdeaService,
    protected ideaFunnelService: IdeaFunnelService,
    protected incomeService: IncomeService,
    protected outgoingsService: OutgoingsService,
    private generalService: GeneralService,
  ) {}

  ngOnInit() {
    this.loadIdeaFunnel();
  }


  loadIdeaFunnel() {
      this.ideaFunnelService.getIdeaFunnel().subscribe((res: HttpResponse<any>) => {
        this.mind2 = res.body;
        const _jm = new MindMapMain(option);
        this.mindMap = _jm;
        _jm.fetchData(this.mind2).then((value) => {
           this.m = value;
        }).then(() => {
          // _jm.calculateAll();
        }).then(() => {
          _jm.show(this.m);
        });
    });
  }

  removeNode() {
    const selectedNode = this.mindMap.getSelectedNode();
    const selectedId = selectedNode && selectedNode.id;

    if (!selectedId) {
      return;
    }
    this.mindMap.removeNode(selectedId);
  }

  addNode() {
    const selectedNode = this.mindMap.getSelectedNode();
    if (!selectedNode) {
      return;
    }

    const nodeId = customizeUtil.uuid.newid();
    this.mindMap.addNode(selectedNode, nodeId);
  }

  zoomIn() {
    this.mindMap.zoomIn();
  }

  zoomOut() {
    this.mindMap.zoomOut();
  }

  getParent() {
    const selectedNode = this.mindMap.getSelectedNode();
    if (!selectedNode) {
      return;
    }

    this.mindMap.getParent(selectedNode);
  }

  calculateProfit() {
    this.generalService.calcBalances();
  }

  getMindMapData() {
    const data = this.mindMap.getData().data;
  }
}
