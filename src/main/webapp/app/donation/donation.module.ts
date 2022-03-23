import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationComponent } from './donation.component';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'primeng/card';
import { PaymentModule } from 'app/views/payment/payment.module';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CardModule,
    PaymentModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TableModule
  ],
  declarations: [DonationComponent]
})
export class DonationModule { }
