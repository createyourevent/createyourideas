import { Route } from '@angular/router';
import { DonationComponent } from './donation.component';


export const DONATION_ROUTE: Route = {
  path: '',
  component: DonationComponent,
  data: {
    pageTitle: 'donation-page.title',
  },
};
