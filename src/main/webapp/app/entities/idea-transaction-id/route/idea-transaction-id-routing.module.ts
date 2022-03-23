import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IdeaTransactionIdComponent } from '../list/idea-transaction-id.component';
import { IdeaTransactionIdDetailComponent } from '../detail/idea-transaction-id-detail.component';
import { IdeaTransactionIdUpdateComponent } from '../update/idea-transaction-id-update.component';
import { IdeaTransactionIdRoutingResolveService } from './idea-transaction-id-routing-resolve.service';

const ideaTransactionIdRoute: Routes = [
  {
    path: '',
    component: IdeaTransactionIdComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdeaTransactionIdDetailComponent,
    resolve: {
      ideaTransactionId: IdeaTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdeaTransactionIdUpdateComponent,
    resolve: {
      ideaTransactionId: IdeaTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdeaTransactionIdUpdateComponent,
    resolve: {
      ideaTransactionId: IdeaTransactionIdRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ideaTransactionIdRoute)],
  exports: [RouterModule],
})
export class IdeaTransactionIdRoutingModule {}
