import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'idea',
        data: { pageTitle: 'createyourideasApp.idea.home.title' },
        loadChildren: () => import('./idea/idea.module').then(m => m.IdeaModule),
      },
      {
        path: 'income',
        data: { pageTitle: 'createyourideasApp.income.home.title' },
        loadChildren: () => import('./income/income.module').then(m => m.IncomeModule),
      },
      {
        path: 'outgoings',
        data: { pageTitle: 'createyourideasApp.outgoings.home.title' },
        loadChildren: () => import('./outgoings/outgoings.module').then(m => m.OutgoingsModule),
      },
      {
        path: 'balance',
        data: { pageTitle: 'createyourideasApp.balance.home.title' },
        loadChildren: () => import('./balance/balance.module').then(m => m.BalanceModule),
      },
      {
        path: 'worksheet',
        data: { pageTitle: 'createyourideasApp.worksheet.home.title' },
        loadChildren: () => import('./worksheet/worksheet.module').then(m => m.WorksheetModule),
      },
      {
        path: 'feedback',
        data: { pageTitle: 'createyourideasApp.feedback.home.title' },
        loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule),
      },
      {
        path: 'profit-balance',
        data: { pageTitle: 'createyourideasApp.profitBalance.home.title' },
        loadChildren: () => import('./profit-balance/profit-balance.module').then(m => m.ProfitBalanceModule),
      },
      {
        path: 'share',
        data: { pageTitle: 'createyourideasApp.share.home.title' },
        loadChildren: () => import('./share/share.module').then(m => m.ShareModule),
      },
      {
        path: 'point',
        data: { pageTitle: 'createyourideasApp.point.home.title' },
        loadChildren: () => import('./point/point.module').then(m => m.PointModule),
      },
      {
        path: 'user-point-association',
        data: { pageTitle: 'createyourideasApp.userPointAssociation.home.title' },
        loadChildren: () => import('./user-point-association/user-point-association.module').then(m => m.UserPointAssociationModule),
      },
      {
        path: 'donation',
        data: { pageTitle: 'createyourideasApp.donation.home.title' },
        loadChildren: () => import('./donation/donation.module').then(m => m.DonationModule),
      },
      {
        path: 'idea-transaction-id',
        data: { pageTitle: 'createyourideasApp.ideaTransactionId.home.title' },
        loadChildren: () => import('./idea-transaction-id/idea-transaction-id.module').then(m => m.IdeaTransactionIdModule),
      },
      {
        path: 'application',
        data: { pageTitle: 'createyourideasApp.application.home.title' },
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'createyourideasApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'monthly-income-invoice',
        data: { pageTitle: 'createyourideasApp.monthlyIncomeInvoice.home.title' },
        loadChildren: () => import('./monthly-income-invoice/monthly-income-invoice.module').then(m => m.MonthlyIncomeInvoiceModule),
      },
      {
        path: 'monthly-outgoings-invoice',
        data: { pageTitle: 'createyourideasApp.monthlyOutgoingsInvoice.home.title' },
        loadChildren: () =>
          import('./monthly-outgoings-invoice/monthly-outgoings-invoice.module').then(m => m.MonthlyOutgoingsInvoiceModule),
      },
      {
        path: 'idea-comment',
        data: { pageTitle: 'createyourideasApp.ideaComment.home.title' },
        loadChildren: () => import('./idea-comment/idea-comment.module').then(m => m.IdeaCommentModule),
      },
      {
        path: 'idea-like-dislike',
        data: { pageTitle: 'createyourideasApp.ideaLikeDislike.home.title' },
        loadChildren: () => import('./idea-like-dislike/idea-like-dislike.module').then(m => m.IdeaLikeDislikeModule),
      },
      {
        path: 'idea-star-rating',
        data: { pageTitle: 'createyourideasApp.ideaStarRating.home.title' },
        loadChildren: () => import('./idea-star-rating/idea-star-rating.module').then(m => m.IdeaStarRatingModule),
      },
      {
        path: 'properties',
        data: { pageTitle: 'createyourideasApp.properties.home.title' },
        loadChildren: () => import('./properties/properties.module').then(m => m.PropertiesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
