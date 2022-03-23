import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { IBalance } from 'app/entities/balance/balance.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Pipe({
  name: 'balancesData'
})
export class BalancesDataPipe implements PipeTransform {

  constructor(private generalService: GeneralService,) {}

  transform(ideaId: number, args?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      const now = dayjs();
      this.generalService.queryIdeaByActiveTrueEagerAll(ideaId).subscribe(i => {
        const idea = i.body;
        const balances = idea.balances;
        const balancesInMonth: IBalance[] = [];
        balances.forEach(balance => {
          if(dayjs(balance.date).month() === now.month()) {
            balancesInMonth.push(balance);
          }
        })
        const labels = [];
        const dbData = [];
        const npData = [];
        balancesInMonth.forEach(e => {
          labels.push(new DatePipe("de-CH").transform(dayjs(e.date).toDate(), 'mediumDate'));
          dbData.push(e.dailyBalance);
          npData.push(e.netProfit);
        });

        const basicData: any = {
            labels: labels,
            datasets: [
                {
                    label: 'Daily balance',
                    data: dbData,
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: .4
                },
                {
                  label: 'Net profit',
                  data: npData,
                  fill: false,
                  borderColor: '#FFA726',
                  tension: .4
              }
            ]
        };
        resolve(basicData);
      });

    })
  }

}
