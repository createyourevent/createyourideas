
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { IdeaPinwallComponent } from './idea-pinwall.component';
import { IDEA_PINWALL_ROUTE } from './idea-pinwall.route';
import { SelectDropDownModule } from 'ngx-select-dropdown'

@NgModule({
  imports: [SharedModule, RouterModule.forChild([IDEA_PINWALL_ROUTE]), SelectDropDownModule],
  declarations: [IdeaPinwallComponent]
})
export class HomeIdeaPinwallModule {}
