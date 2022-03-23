import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';

const routes: Routes = [
{
  path: '',
  component: BillingComponent,
  data: {
    pageTitle: 'billing.title',
  },
},
];

export const BillingRoutes = RouterModule.forChild(routes);
