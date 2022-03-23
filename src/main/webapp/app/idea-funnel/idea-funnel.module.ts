import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IDEA_FUNNEL_ROUTE } from './idea-funnel.route';
import { IdeaFunnelComponent } from './idea-funnel.component';
import { SharedModule } from 'app/shared/shared.module';
import { BaseRateModule } from 'app/views/base_rate/base_rate.module';


@NgModule({
  imports: [SharedModule,
            RouterModule.forChild([IDEA_FUNNEL_ROUTE]),
            BaseRateModule],
  declarations: [IdeaFunnelComponent]
})
export class IdeaFunnelModule {}
