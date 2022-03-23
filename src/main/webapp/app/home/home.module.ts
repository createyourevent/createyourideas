import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { GearComponent } from 'app/views/gear/gear.component';

@NgModule({
  imports: [SharedModule,
            RouterModule.forChild([HOME_ROUTE]),
            CarouselModule,
            CardModule,
            ChartModule],
  declarations: [HomeComponent, GearComponent],
})
export class HomeModule {}
