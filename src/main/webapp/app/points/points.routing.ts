import { Routes, RouterModule } from '@angular/router';
import { PointsComponent } from './points.component';

const routes: Routes = [
  {
    path: '',
    component: PointsComponent,
    data: {
      authorities: [],
      pageTitle: 'points.title'
    }
  }
];

export const PointsRoutes = RouterModule.forChild(routes);
