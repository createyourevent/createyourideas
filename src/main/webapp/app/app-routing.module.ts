
import { EmployeesComponent } from './ideas/employees/employees.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DashboardIdeaComponent } from './views/idea/dashboard-idea/dashboard-idea.component';
import { OverviewIdeaComponent } from './views/idea/dashboard-idea/overview-idea/overview-idea.component';
import { IncomesComponent } from './views/idea/dashboard-idea/incomes/incomes.component';
import { OutgoingsComponent } from './views/idea/dashboard-idea/outgoings/outgoings.component';
import { DashboardIdeaResolveService } from './views/idea/dashboard-idea/dashboard-idea-resolve.service';
import { ViewIdeaComponent } from './views/idea/view-idea/view-idea.component';
import { ViewIdeaResolveService } from './views/idea/view-idea/view-idea-resolve.service';
import { DonationComponent } from './donation/donation.component';
import { EmployeesResolveService } from './ideas/employees/employees-resolve.service';
import { ApplicationComponent } from './ideas/employees/application/application.component';
import { EmployeeManagementComponent } from './views/idea/employee-management/employee-management.component';
import { EmployeeManagementResolveService } from './views/idea/employee-management/employee-management-resolve.service';
import { SettingsComponent } from './account/settings/settings.component';
import { MyJobsComponent } from './employee/my-jobs/my-jobs.component';
import { WorksheetsComponent as WorksheetsEmployeeComponent } from './views/employee/worksheets/worksheets.component';
import { WorksheetsComponent } from './views/idea/dashboard-idea/worksheets/worksheets.component';
import { WorksheetsResolveService } from './views/employee/worksheets/worksheets-resolve.service';
import { DonationsComponent } from './views/idea/dashboard-idea/donations/donations.component';
import { EditIdeaComponent } from './views/idea/edit-idea/edit-idea.component';
import { DashboardConfigIdeaComponent } from './views/idea/dashboard-config-idea/dashboard-config-idea.component';
import { OverviewConfigIdeaComponent } from './views/idea/dashboard-config-idea/overview-config-idea/overview-config-idea.component';
import { CommentsIdeaComponent } from './views/idea/dashboard-config-idea/comments-idea/comments-idea.component';
import { RatingsIdeaComponent } from './views/idea/dashboard-config-idea/ratings-idea/ratings-idea.component';
import { BillingComponent } from './idea/billing/billing.component';
import { BillingResolveService } from './idea/billing/billing-resolve.service';
import { IdeaFunnelComponent } from './idea-funnel/idea-funnel.component';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'create-idea',
          data: {
            authorities: [Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./idea/create-idea/create-idea.module').then(m => m.CreateIdeaModule),
        },
        {
          path: 'my-ideas',
          data: {
            authorities: [Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./idea/idea-list/idea-list.module').then(m => m.IdeaListModule),
        },
        {
          path: 'dashboard/config/:id/view',
          component: DashboardConfigIdeaComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: DashboardIdeaResolveService,
          },
          canActivate: [UserRouteAccessService],
          children: [
            { path: '',
              component: OverviewConfigIdeaComponent,
              resolve: {
                idea: DashboardIdeaResolveService
              }
              },
            { path: 'comments', component: CommentsIdeaComponent},
            { path: 'ratings', component: RatingsIdeaComponent},
        ]
        },
        {
          path: 'dashboard/:id/view',
          component: DashboardIdeaComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: DashboardIdeaResolveService,
          },
          canActivate: [UserRouteAccessService],
          children: [
            { path: '',
              component: OverviewIdeaComponent,
              resolve: {
                idea: DashboardIdeaResolveService
              }
              },
            { path: 'overview', component: OverviewIdeaComponent },
            { path: 'incomes', component: IncomesComponent },
            { path: 'outgoings', component: OutgoingsComponent },
            { path: 'worksheets', component: WorksheetsComponent },
            { path: 'donations', component: DonationsComponent },
        ]
        },
        {
          path: 'ideas/:id/donation',
          component: DonationComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: DashboardIdeaResolveService,
          },
          loadChildren: () => import('./donation/donation.module').then(m => m.DonationModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'ideas/:id/edit',
          component: EditIdeaComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: DashboardIdeaResolveService,
          },
          loadChildren: () => import('./views/idea/edit-idea/edit-idea.module').then(m => m.EditIdeaModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'ideas/:id/billing',
          component: BillingComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: BillingResolveService,
          },
          loadChildren: () => import('./idea/billing/billing.module').then(m => m.BillingModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'ideas/:id/employees',
          component: EmployeesComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: EmployeesResolveService,
          },
          loadChildren: () => import('./ideas/employees/employees.module').then(m => m.EmployeesModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'ideas/:id/application',
          component: ApplicationComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: EmployeesResolveService,
          },
          loadChildren: () => import('./ideas/employees/application/application.module').then(m => m.ApplicationModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'ideas/:id/employee-management',
          component: EmployeeManagementComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: EmployeeManagementResolveService,
          },
          loadChildren: () => import('./views/idea/employee-management/employee-management.module').then(m => m.EmployeeManagementModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'ideas/:id/view',
          component: ViewIdeaComponent,
          resolve: {
            idea: ViewIdeaResolveService,
          },
          loadChildren: () => import('./views/idea/view-idea/view-idea.module').then(m => m.ViewIdeaModule),
        },
        {
          path: 'settings',
          component: SettingsComponent,
          data: {
            authorities: [Authority.USER],
          },
          loadChildren: () => import('./account/settings/settings.module').then(m => m.SettingsModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'my-jobs',
          component: MyJobsComponent,
          data: {
            authorities: [Authority.USER],
          },
          loadChildren: () => import('./employee/my-jobs/my-jobs.module').then(m => m.MyJobsModule),
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'employee/:id/worksheets',
          component: WorksheetsEmployeeComponent,
          data: {
            authorities: [Authority.USER],
          },
          resolve: {
            idea: WorksheetsResolveService,
          },
          loadChildren: () => import('./views/employee/worksheets/worksheets.module').then(m => m.WorksheetsModule),
          canActivate: [UserRouteAccessService],
        },
        ...LAYOUT_ROUTES,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
