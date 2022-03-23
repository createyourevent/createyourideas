import { Routes, RouterModule } from '@angular/router';
import { MyJobsComponent } from './my-jobs.component';

const routes: Routes = [
  {
  path: '',
  component: MyJobsComponent,
  data: {
    pageTitle: 'my-jobs.title',
  }
  }
];

export const MyJobsRoutes = RouterModule.forChild(routes);
