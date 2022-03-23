import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SharedModule } from 'app/shared/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactFeelingFormComponent } from '../datatrans_react/Datatrans.component';
import { SuccessfullComponent } from './successfull/successfull.component';
import { PAYMENT_ROUTE } from './payment.routing';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CancelComponent } from './cancel/cancel.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    ToastModule,
    SharedModule,
    ButtonModule,
    MatToolbarModule,
    RouterModule.forChild(PAYMENT_ROUTE),
    ProgressSpinnerModule
  ],
  declarations: [PaymentComponent, ReactFeelingFormComponent, SuccessfullComponent, ErrorComponent, CancelComponent],
  exports: [PaymentComponent, ReactFeelingFormComponent]
})
export class PaymentModule { }
