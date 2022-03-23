import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProfitBalanceComponent } from './list/profit-balance.component';
import { ProfitBalanceDetailComponent } from './detail/profit-balance-detail.component';
import { ProfitBalanceUpdateComponent } from './update/profit-balance-update.component';
import { ProfitBalanceDeleteDialogComponent } from './delete/profit-balance-delete-dialog.component';
import { ProfitBalanceRoutingModule } from './route/profit-balance-routing.module';

@NgModule({
  imports: [SharedModule, ProfitBalanceRoutingModule],
  declarations: [ProfitBalanceComponent, ProfitBalanceDetailComponent, ProfitBalanceUpdateComponent, ProfitBalanceDeleteDialogComponent],
  entryComponents: [ProfitBalanceDeleteDialogComponent],
})
export class ProfitBalanceModule {}
