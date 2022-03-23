import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { SharedModule } from 'app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { EmployeesRoutes } from './employees.routing';
import { EmployeeComponent } from './employee/employee.component';
import { ApplicationComponent } from './application/application.component';
import { ApplicationRoutes } from './application/application.routing';
import { OrganizationChartModule } from 'primeng/organizationchart';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TableModule,
    CardModule,
    EmployeesRoutes,
    OrganizationChartModule
  ],
  declarations: [EmployeesComponent, EmployeeComponent]
})
export class EmployeesModule { }
