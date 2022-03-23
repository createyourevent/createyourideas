import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WorksheetsComponent } from './worksheets.component';

const routes: Routes = [
  {
    path: '',
    component: WorksheetsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
];

export const WorksheetsRoutes = RouterModule.forChild(routes);
