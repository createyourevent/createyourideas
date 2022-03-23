import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRateComponent } from './base_rate.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [BaseRateComponent],
  exports: [BaseRateComponent]
})
export class BaseRateModule { }
