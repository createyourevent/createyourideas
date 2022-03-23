import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { IdeaPinwallComponent } from './idea-pinwall.component';

export const IDEA_PINWALL_ROUTE: Route = {
  path: 'idea-pinwall',
  component: IdeaPinwallComponent,
  data: {
    pageTitle: 'createyourideas.menu.idea-pinwall'
  },
};
