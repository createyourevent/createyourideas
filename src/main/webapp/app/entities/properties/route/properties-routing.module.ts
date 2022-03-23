import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PropertiesComponent } from '../list/properties.component';
import { PropertiesDetailComponent } from '../detail/properties-detail.component';
import { PropertiesUpdateComponent } from '../update/properties-update.component';
import { PropertiesRoutingResolveService } from './properties-routing-resolve.service';

const propertiesRoute: Routes = [
  {
    path: '',
    component: PropertiesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PropertiesDetailComponent,
    resolve: {
      properties: PropertiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PropertiesUpdateComponent,
    resolve: {
      properties: PropertiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PropertiesUpdateComponent,
    resolve: {
      properties: PropertiesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(propertiesRoute)],
  exports: [RouterModule],
})
export class PropertiesRoutingModule {}
