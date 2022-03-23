import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommentBoxComponent } from './comment-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminCommentBoxComponent } from './admin/admin-comment-box.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    InputTextareaModule,
    TableModule,
    ButtonModule,
    OverlayPanelModule
  ],
  declarations: [CommentBoxComponent, AdminCommentBoxComponent],
  exports: [CommentBoxComponent, AdminCommentBoxComponent]
})
export class CommentBoxModule {}
