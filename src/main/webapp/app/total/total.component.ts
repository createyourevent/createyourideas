import { GeneralService } from './../general.service';

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IIncome } from 'app/entities/income/income.model';
import { IncomeService } from 'app/entities/income/service/income.service';
import { IOutgoings } from 'app/entities/outgoings/outgoings.model';
import { OutgoingsService } from 'app/entities/outgoings/service/outgoings.service';
import { WorksheetService } from 'app/entities/worksheet/service/worksheet.service';
import { IWorksheet } from 'app/entities/worksheet/worksheet.model';
import * as FusionCharts from 'fusioncharts';
const dataUrl = 'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/line-chart-with-time-axis-data.json';
const schemaUrl = 'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/line-chart-with-time-axis-schema.json';

@Component({
  selector: 'jhi-total',
  templateUrl: './total.component.html',
  styleUrls: ['total.scss']
})
export class TotalComponent implements OnInit, OnDestroy {
  investPerIdea: number;
  allIncomesPerIdea: number;
  allOutgoingsPerIdea: number;
  allWorksheetsPerIdea: number;

  ideas: IIdea[];
  selectedIdea: IIdea;

  incomes: IIncome[];
  outgoings: IOutgoings[];
  worksheets: IWorksheet[];
  dailyBalance: number;

  dataSource: any;
  type: string;
  width: string;
  height: string;

  selectIdeaForm = this.fb.group({
    ideaName: ['']
  });

  constructor(
    protected worksheetService: WorksheetService,
    protected outgoingsService: OutgoingsService,
    protected incomeService: IncomeService,
    protected ideaService: IdeaService,
    public fb: FormBuilder,
    private generalService: GeneralService
  ) {
    this.loadSelect();
    this.type = 'timeseries';
    this.width = '700';
    this.height = '400';
    this.dataSource = {
      data: null,
      caption: {
        text: 'Sales Analysis'
      },
      subcaption: {
        text: 'Grocery'
      },
      yAxis: [
        {
          plot: {
            value: 'Grocery Sales Value',
            type: 'line'
          },
          format: {
            prefix: '$'
          },
          title: 'Sale Value'
        }
      ]
    };
    this.fetchData();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  fetchData() {
    const jsonify = res => res.json();
    const dataFetch = fetch(dataUrl).then(jsonify);
    const schemaFetch = fetch(schemaUrl).then(jsonify);
    Promise.all([dataFetch, schemaFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      const fusionTable = new FusionCharts.DataStore().createDataTable(data, schema); // Instance of DataTable to be passed as data in dataSource
      this.dataSource.data = fusionTable;
    });
  }

  calculateWorksheets() {
    this.ideaService.find(parseInt(this.selectIdeaForm.get('ideaName').value, 10)).subscribe((res: HttpResponse<IIdea>) => {
      this.selectedIdea = res.body;
    });
    let total = 0;
    for (let i = 0; i < this.worksheets.length; i++) {
      total += this.worksheets[i].costHour * Number(this.worksheets[i].hours);
    }
    this.allWorksheetsPerIdea = total;
  }

  calculateIncomes() {
    return new Promise<number>(value => {
      this.generalService.queryIncomeByIdeaId(this.selectedIdea.id).subscribe((resi: HttpResponse<IIncome[]>) => {
        this.incomes = resi.body;
        let total = 0;
        for (let i = 0; i < this.incomes.length; i++) {
          total += this.incomes[i].value;
        }
        value(total);
      });
    });
  }

  calculateDailyBalance() {
    return new Promise<number>(value => {
      let totalIncomes = 0;
      let totalOutgoings = 0;
      this.generalService.queryIncomeByIdeaId(this.selectedIdea.id).subscribe((resi: HttpResponse<IIncome[]>) => {
        this.incomes = resi.body;
        for (let i = 0; i < this.incomes.length; i++) {
          totalIncomes += this.incomes[i].value;
        }
        this.generalService.queryOutgoingByIdeaId(this.selectedIdea.id).subscribe((reso: HttpResponse<IOutgoings[]>) => {
          this.outgoings = reso.body;
          for (let i = 0; i < this.outgoings.length; i++) {
            totalOutgoings += this.outgoings[i].value;
          }
          value(totalIncomes - totalOutgoings);
        });
      });
    });
  }

  calculateOutgoings() {

    return new Promise<number>(value => {
      this.generalService.queryOutgoingByIdeaId(this.selectedIdea.id).subscribe((reso: HttpResponse<IOutgoings[]>) => {
        this.outgoings = reso.body;
        let total = 0;
        for (let i = 0; i < this.outgoings.length; i++) {
          total += this.outgoings[i].value;
        }
        value(total);
      });
    });

  }

  changeIdea() {
    this.ideaService.find(parseInt(this.selectIdeaForm.get('ideaName').value, 10)).subscribe((res: HttpResponse<IIdea>) => {
      this.selectedIdea = res.body;
      this.investPerIdea = this.selectedIdea.investment;
      this.calculateIncomes().then(value => {
        this.allIncomesPerIdea = value;
      });
      this.calculateOutgoings().then(value => {
        this.allOutgoingsPerIdea = value;
      });
      this.calculateDailyBalance().then(value => {
        this.dailyBalance = value;
      });
      this.calculateWorksheets();
    });
  }

  loadSelect() {
    this.generalService.queryByUser().subscribe((res: HttpResponse<IIdea[]>) => {
      this.ideas = res.body;
    });
  }
}
