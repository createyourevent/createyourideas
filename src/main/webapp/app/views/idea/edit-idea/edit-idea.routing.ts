import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreateIdeaResolveService } from 'app/idea/create-idea/create-idea-resolve.service';
import { EditIdeaComponent } from './edit-idea.component';

const routes: Routes = [
  {
    path: '',
    component: EditIdeaComponent,
    resolve: {
      idea: CreateIdeaResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

export const EditIdeaRoutes = RouterModule.forChild(routes);
