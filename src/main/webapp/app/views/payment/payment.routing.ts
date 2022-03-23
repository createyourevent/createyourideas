import { Routes } from '@angular/router';
import { CancelComponent } from './cancel/cancel.component';
import { ErrorComponent } from './error/error.component';
import { SuccessfullComponent } from './successfull/successfull.component';


export const PAYMENT_ROUTE: Routes =  [{
  path: 'success/:type/:id/:refNo',
  component: SuccessfullComponent,
},
{
  path: 'error/:type/:id/:refNo',
  component: ErrorComponent,
},
{
  path: 'cancel/:type/:id/:refNo',
  component: CancelComponent,
},
];
