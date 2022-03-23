import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointsComponent } from './points.component';
import { SharedModule } from 'app/shared/shared.module';
import { PointsRoutes } from './points.routing';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  imports: [CommonModule, SharedModule, PointsRoutes, TabViewModule],
  declarations: [PointsComponent]
})
export class PointsModule {}
