import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingComponent } from './accounting.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ACCOUNTING_ROUTE } from './accounting.route';
import { RouterModule } from '@angular/router';
import { IncomeModule } from 'app/entities/income/income.module';
import { OutgoingsModule } from 'app/entities/outgoings/outgoings.module';
import {  WorksheetModule } from 'app/entities/worksheet/worksheet.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AccountingComponent],
  imports: [
	  TabsModule.forRoot(),
	  RouterModule.forChild([ACCOUNTING_ROUTE]),
    CommonModule,
    IncomeModule,
    OutgoingsModule,
    WorksheetModule,
    FormsModule,
    ReactiveFormsModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeAccountingModule { }
