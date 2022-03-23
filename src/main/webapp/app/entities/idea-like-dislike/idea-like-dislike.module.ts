import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IdeaLikeDislikeComponent } from './list/idea-like-dislike.component';
import { IdeaLikeDislikeDetailComponent } from './detail/idea-like-dislike-detail.component';
import { IdeaLikeDislikeUpdateComponent } from './update/idea-like-dislike-update.component';
import { IdeaLikeDislikeDeleteDialogComponent } from './delete/idea-like-dislike-delete-dialog.component';
import { IdeaLikeDislikeRoutingModule } from './route/idea-like-dislike-routing.module';

@NgModule({
  imports: [SharedModule, IdeaLikeDislikeRoutingModule],
  declarations: [
    IdeaLikeDislikeComponent,
    IdeaLikeDislikeDetailComponent,
    IdeaLikeDislikeUpdateComponent,
    IdeaLikeDislikeDeleteDialogComponent,
  ],
  entryComponents: [IdeaLikeDislikeDeleteDialogComponent],
})
export class IdeaLikeDislikeModule {}
