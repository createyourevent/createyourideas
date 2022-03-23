import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewIdeaComponent } from './view-idea.component';
import { CardModule } from 'primeng/card';
import { CommentBoxModule } from 'app/views/comment-box/comment-box.module';
import { LikeDislikeModule } from 'app/views/ratings/like_dislike/like_dislike.module';
import { StarRatingModule } from 'app/views/ratings/starRating/starRating.module';
import { RatingsIdeaComponent } from '../dashboard-config-idea/ratings-idea/ratings-idea.component';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    SharedModule,
    CommentBoxModule,
    LikeDislikeModule,
    StarRatingModule,
  ],
  declarations: [ViewIdeaComponent]
})
export class ViewIdeaModule { }
