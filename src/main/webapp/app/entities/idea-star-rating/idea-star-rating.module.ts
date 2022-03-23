import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IdeaStarRatingComponent } from './list/idea-star-rating.component';
import { IdeaStarRatingDetailComponent } from './detail/idea-star-rating-detail.component';
import { IdeaStarRatingUpdateComponent } from './update/idea-star-rating-update.component';
import { IdeaStarRatingDeleteDialogComponent } from './delete/idea-star-rating-delete-dialog.component';
import { IdeaStarRatingRoutingModule } from './route/idea-star-rating-routing.module';

@NgModule({
  imports: [SharedModule, IdeaStarRatingRoutingModule],
  declarations: [
    IdeaStarRatingComponent,
    IdeaStarRatingDetailComponent,
    IdeaStarRatingUpdateComponent,
    IdeaStarRatingDeleteDialogComponent,
  ],
  entryComponents: [IdeaStarRatingDeleteDialogComponent],
})
export class IdeaStarRatingModule {}
