import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeManagementComponent } from './employee-management.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ButtonModule } from 'primeng/button';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TableModule,
    InputSwitchModule,
    TriStateCheckboxModule,
    ButtonModule
  ],
  declarations: [EmployeeManagementComponent]
})
export class EmployeeManagementModule { }
