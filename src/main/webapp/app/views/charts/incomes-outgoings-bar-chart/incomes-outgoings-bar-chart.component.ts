import { Component, Input, OnInit } from '@angular/core';
import { IIdea } from 'app/entities/idea/idea.model';
import { IIncome } from 'app/entities/income/income.model';
import { IOutgoings } from 'app/entities/outgoings/outgoings.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-incomes-outgoings-bar-chart',
  templateUrl: './incomes-outgoings-bar-chart.component.html',
  styleUrls: ['./incomes-outgoings-bar-chart.component.scss']
})
export class IncomesOutgoingsBarChartComponent implements OnInit {

  @Input() idea: IIdea;
  basicData: any;
  basicOptions: any;

  incomes: IIncome[];
  outgoings: IOutgoings[];

  constructor(private generalService: GeneralService) {
  }

  ngOnInit() {
    const now = dayjs();
    const dayOfYear = dayjs().dayOfYear();
    const incomesMonth: IIncome[] = [];
    const outgoingsMonth: IOutgoings[] = [];
    const incomesData: number[] = [];
    const outgoingsData: number[] = [];

    this.loadVals().then(() => {
      this.incomes.forEach(income => {
        if(dayjs(income.date).month() === now.month()) {
          incomesMonth.push(income);
        }
      });
      this.outgoings.forEach(outgoing => {
        if(dayjs(outgoing.date).month() === now.month()) {
          outgoingsMonth.push(outgoing);
        }
      });

      const labels = [];
      const getDaysInMonth = (month, year) => (new Array(31)).fill('').map((v,i)=>new Date(year,month-1,i+1)).filter(v=>v.getMonth()===month-1);
      const dates: Date[] = getDaysInMonth(11, 2021);

      dates.forEach(d => {
        labels.push(d.toLocaleDateString());

        const incomesDay: number[] = [];
        incomesMonth.forEach(im => {
          if(dayjs(im.date).dayOfYear() === dayjs(d).dayOfYear()) {
            incomesDay.push(im.value);
          }
        });
        let dailyIncome = 0;
        incomesDay.forEach(id => {
          dailyIncome += id;
        });
        incomesData[(new Date(d).getDate()) - 1] = dailyIncome;

        const outgoingsDay: number[] = [];
        outgoingsMonth.forEach(im => {
          if(dayjs(im.date).dayOfYear() === dayjs(d).dayOfYear()) {
            outgoingsDay.push(im.value);
          }
        });
        let dailyOutgoing = 0;
        outgoingsDay.forEach(id => {
          dailyOutgoing += id;
        });
        outgoingsData[(new Date(d).getDate()) - 1] = dailyOutgoing;
      });


      this.basicData = {
        labels: labels,
        datasets: [
            {
                label: 'Incomes',
                backgroundColor: '#42A5F5',
                data: incomesData
            },
            {
                label: 'Outgoings',
                backgroundColor: '#FFA726',
                data: outgoingsData
            }
        ]
      };
    });

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#000000'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#000000'
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                }
            },
            y: {
                ticks: {
                    color: '#000000'
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                }
            }
        }
    };
  }

  loadVals(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.generalService.queryIncomeByIdeaId(this.idea.id).subscribe(i => {
        this.incomes = i.body;
        this.generalService.queryOutgoingByIdeaId(this.idea.id).subscribe(o => {
          this.outgoings = o.body;
          resolve(true);
        });
      });
    })
  }

}
