import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorksheetComponent } from '../list/worksheet.component';
import { WorksheetDetailComponent } from '../detail/worksheet-detail.component';
import { WorksheetUpdateComponent } from '../update/worksheet-update.component';
import { WorksheetRoutingResolveService } from './worksheet-routing-resolve.service';

const worksheetRoute: Routes = [
  {
    path: '',
    component: WorksheetComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorksheetDetailComponent,
    resolve: {
      worksheet: WorksheetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorksheetUpdateComponent,
    resolve: {
      worksheet: WorksheetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorksheetUpdateComponent,
    resolve: {
      worksheet: WorksheetRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(worksheetRoute)],
  exports: [RouterModule],
})
export class WorksheetRoutingModule {}
