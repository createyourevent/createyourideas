import { Routes, RouterModule } from '@angular/router';
import { ExchangeComponent } from './exchange.component';

const routes: Routes = [
  {
    path: '',
    component: ExchangeComponent,
    data: {
      authorities: [],
      pageTitle: 'exchange.title'
    }
  }
];

export const ExchangeRoutes = RouterModule.forChild(routes);
