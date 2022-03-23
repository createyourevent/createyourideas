import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IdeaCommentComponent } from './list/idea-comment.component';
import { IdeaCommentDetailComponent } from './detail/idea-comment-detail.component';
import { IdeaCommentUpdateComponent } from './update/idea-comment-update.component';
import { IdeaCommentDeleteDialogComponent } from './delete/idea-comment-delete-dialog.component';
import { IdeaCommentRoutingModule } from './route/idea-comment-routing.module';

@NgModule({
  imports: [SharedModule, IdeaCommentRoutingModule],
  declarations: [IdeaCommentComponent, IdeaCommentDetailComponent, IdeaCommentUpdateComponent, IdeaCommentDeleteDialogComponent],
  entryComponents: [IdeaCommentDeleteDialogComponent],
})
export class IdeaCommentModule {}
