import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardConfigIdeaComponent } from './dashboard-config-idea.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyFieldCalendar } from 'app/formly-fields/formly-field-primeng-calendar';
import { MaterialModule } from 'app/material-module';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { AdminLikeDislikeModule } from 'app/views/ratings/like_dislike/admin_like_dislike/admin_like_dislike.module';
import { RatingsIdeaComponent } from './ratings-idea/ratings-idea.component';
import { StarRatingModule } from 'app/views/ratings/starRating/starRating.module';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { CommentsIdeaComponent } from './comments-idea/comments-idea.component';

@NgModule({
  imports: [
    CommentBoxModule,
    StarRatingModule,
    SharedModule,
    AdminLikeDislikeModule,
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatListModule,
    RouterModule,
    MaterialModule,
    TableModule,
    MatCardModule,
    CalendarModule,
    CardModule,
    ChartModule,
    FormlyPrimeNGModule, NgSelectModule,
    FormlyModule.forRoot({
      types: [
        { name: 'datepicker', component: FormlyFieldCalendar }
      ]
    })
  ],
  declarations: [DashboardConfigIdeaComponent, RatingsIdeaComponent, CommentsIdeaComponent]
})
export class DashboardConfigIdeaModule { }
