import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmployeeManagementComponent } from './employee-management.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
];

export const EmployeeManagementRoutes = RouterModule.forChild(routes);
