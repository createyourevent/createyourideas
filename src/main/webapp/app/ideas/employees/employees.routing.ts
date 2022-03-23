import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmployeesComponent } from './employees.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },

];

export const EmployeesRoutes = RouterModule.forChild(routes);
