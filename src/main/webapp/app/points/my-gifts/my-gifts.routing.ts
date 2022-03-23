import { Routes, RouterModule } from '@angular/router';
import { MyGiftsComponent } from './my-gifts.component';

const routes: Routes = [
  {
    path: '',
    component: MyGiftsComponent,
    data: {
      authorities: [],
      pageTitle: 'exchange.title'
    }
  }
];

export const MyGiftsRoutes = RouterModule.forChild(routes);
