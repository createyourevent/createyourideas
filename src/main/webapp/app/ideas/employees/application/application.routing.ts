import { ApplicationComponent } from './../../../entities/application/list/application.component';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
];

export const ApplicationRoutes = RouterModule.forChild(routes);
