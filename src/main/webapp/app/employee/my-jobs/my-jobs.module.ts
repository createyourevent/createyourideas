import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyJobsComponent } from './my-jobs.component';
import { MyJobsRoutes } from './my-jobs.routing';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyJobsRoutes,
    TableModule
  ],
  declarations: [MyJobsComponent]
})
export class MyJobsModule { }
