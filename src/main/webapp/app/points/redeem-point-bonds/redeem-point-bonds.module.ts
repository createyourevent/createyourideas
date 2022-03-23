import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedeemPointBondsComponent } from './redeem-point-bonds.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { REDEEMPOINTBONDS_ROUTE } from './redeem-point-bonds.routing';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([REDEEMPOINTBONDS_ROUTE]),
    InputTextModule,
    ButtonModule
  ],
  declarations: [RedeemPointBondsComponent]
})
export class RedeemPointBondsModule { }
