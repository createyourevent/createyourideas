import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LikeDislikeComponent } from './like_dislike.component';
import { AdminLikeDislikeModule } from './admin_like_dislike/admin_like_dislike.module';
import { InputTextareaModule } from 'primeng/inputtextarea';



@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AdminLikeDislikeModule,
    InputTextareaModule,
  ],
  declarations: [LikeDislikeComponent],
  exports: [LikeDislikeComponent]
})
export class LikeDislikeModule {}

