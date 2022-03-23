import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IdeaListResolveService } from './idea-list-resolve.service';
import { IdeaListComponent } from './idea-list.component';

const routes: Routes = [
  {
    path: '',
    component: IdeaListComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
];

export const IdeaListRoutes = RouterModule.forChild(routes);
