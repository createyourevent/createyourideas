import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorksheetsComponent } from './worksheets.component';
import { SharedModule } from 'app/shared/shared.module';
import { WorksheetsRoutes } from './worksheets.routing';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorksheetsRoutes,
    CardModule,
    TableModule
  ],
  declarations: [WorksheetsComponent]
})
export class WorksheetsModule { }
