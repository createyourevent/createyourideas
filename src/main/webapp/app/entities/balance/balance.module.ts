import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BalanceComponent } from './list/balance.component';
import { BalanceDetailComponent } from './detail/balance-detail.component';
import { BalanceUpdateComponent } from './update/balance-update.component';
import { BalanceDeleteDialogComponent } from './delete/balance-delete-dialog.component';
import { BalanceRoutingModule } from './route/balance-routing.module';

@NgModule({
  imports: [SharedModule, BalanceRoutingModule],
  declarations: [BalanceComponent, BalanceDetailComponent, BalanceUpdateComponent, BalanceDeleteDialogComponent],
  entryComponents: [BalanceDeleteDialogComponent],
})
export class BalanceModule {}
