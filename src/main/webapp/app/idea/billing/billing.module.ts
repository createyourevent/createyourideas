import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { BillingRoutes } from './billing.routing';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    BillingRoutes,
    CardModule,
    TableModule
  ],
  declarations: [BillingComponent]
})
export class BillingModule { }
