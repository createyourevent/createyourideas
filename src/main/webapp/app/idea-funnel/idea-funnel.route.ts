import { Route } from '@angular/router';
import { IdeaFunnelComponent } from './idea-funnel.component';


export const IDEA_FUNNEL_ROUTE: Route = {
  path: 'idea-funnel',
  component: IdeaFunnelComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  },
};
