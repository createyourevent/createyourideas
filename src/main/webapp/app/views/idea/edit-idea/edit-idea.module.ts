import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditIdeaComponent } from './edit-idea.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { EditIdeaRoutes } from './edit-idea.routing';
import { KnobModule } from 'primeng/knob';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    QuillModule,
    EditIdeaRoutes,
    KnobModule
  ],
  declarations: [EditIdeaComponent]
})
export class EditIdeaModule { }
