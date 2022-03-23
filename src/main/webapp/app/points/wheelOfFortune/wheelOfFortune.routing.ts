import { Routes, RouterModule } from '@angular/router';
import { WheelOfFortuneComponent } from './wheelOfFortune.component';

const routes: Routes = [
  {
    path: '',
    component: WheelOfFortuneComponent,
    data: {
      authorities: [],
      pageTitle: 'luckySpin.title'
    }
  }
];

export const WheelOfFortuneRoutes = RouterModule.forChild(routes);
