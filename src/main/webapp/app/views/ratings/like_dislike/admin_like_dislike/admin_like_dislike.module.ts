import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AdminLikeDislikeComponent } from './admin_like_dislike.component';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [SharedModule, CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule, TableModule],
  declarations: [AdminLikeDislikeComponent],
  exports: [AdminLikeDislikeComponent]
})
export class AdminLikeDislikeModule {}
