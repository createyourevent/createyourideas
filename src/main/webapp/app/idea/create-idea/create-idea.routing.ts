import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreateIdeaResolveService } from './create-idea-resolve.service';
import { CreateIdeaComponent } from './create-idea.component';

const routes: Routes = [
  {
    path: '',
    component: CreateIdeaComponent,
    resolve: {
      idea: CreateIdeaResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

export const CreateIdeaRoutes = RouterModule.forChild(routes);
