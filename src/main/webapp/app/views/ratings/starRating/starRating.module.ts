import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './starRating.component';
import { AdminStarRatingComponent } from './adminStarRating/adminStarRating.component';
import { RatingModule } from 'primeng/rating';
import { SharedModule } from 'app/shared/shared.module';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [SharedModule, CommonModule, RatingModule, TableModule],
  declarations: [StarRatingComponent, AdminStarRatingComponent],
  exports: [StarRatingComponent, AdminStarRatingComponent]
})
export class StarRatingModule {}
