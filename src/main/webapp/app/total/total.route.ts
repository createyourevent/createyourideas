import { Route } from '@angular/router';

import { TotalComponent } from './total.component';

export const TOTAL_ROUTE: Route = {
  path: 'total',
  component: TotalComponent,
  data: {
    authorities: [],
    pageTitle: 'total.title'
  }
};
