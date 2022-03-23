import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardIdeaComponent } from './dashboard-idea.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import  {MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/material-module';
import { IncomesComponent } from './incomes/incomes.component';
import { WorksheetsComponent } from './worksheets/worksheets.component';
import { OutgoingsComponent } from './outgoings/outgoings.component';
import { TableModule } from 'primeng/table';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import {FormlyPrimeNGModule} from '@ngx-formly/primeng';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { FormlyFieldCalendar } from 'app/formly-fields/formly-field-primeng-calendar';
import { OverviewIdeaComponent } from './overview-idea/overview-idea.component';
import { DonationsComponent } from './donations/donations.component';
import { IncomesOutgoingsBarChartModule } from 'app/views/charts/incomes-outgoings-bar-chart/incomes-outgoings-bar-chart.module';


@NgModule({
  imports: [
    IncomesOutgoingsBarChartModule,
    SharedModule,
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatListModule,
    RouterModule,
    MaterialModule,
    TableModule,
    MatCardModule,
    CalendarModule,
    CardModule,
    ChartModule,
    FormlyPrimeNGModule, NgSelectModule,
    FormlyModule.forRoot({
      types: [
        { name: 'datepicker', component: FormlyFieldCalendar }
      ]
    })
  ],
  declarations: [DashboardIdeaComponent, WorksheetsComponent, IncomesComponent, OutgoingsComponent,  OverviewIdeaComponent, DonationsComponent ]
})
export class DashboardIdeaModule { }
