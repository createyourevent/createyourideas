import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomesOutgoingsBarChartComponent } from './incomes-outgoings-bar-chart.component';
import { ChartModule } from 'primeng/chart';
import  {CardModule } from 'primeng/card';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    ChartModule,
    CardModule,
    CommonModule
  ],
  declarations: [IncomesOutgoingsBarChartComponent],
  exports: [IncomesOutgoingsBarChartComponent]
})
export class IncomesOutgoingsBarChartModule { }
