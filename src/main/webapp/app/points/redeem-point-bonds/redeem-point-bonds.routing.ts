import { Route } from '@angular/router';
import { RedeemPointBondsComponent } from './redeem-point-bonds.component';


export const REDEEMPOINTBONDS_ROUTE: Route = {
  path: '',
  component:RedeemPointBondsComponent,
  data: {
    authorities: [],
    pageTitle: 'home.title'
  }
};
