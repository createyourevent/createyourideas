import { CreateIdeaComponent } from './create-idea.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateIdeaRoutes } from './create-idea.routing';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [SharedModule,
            CommonModule,
            FormsModule,
            CreateIdeaRoutes,
            QuillModule],
  declarations: [CreateIdeaComponent],
  entryComponents: [],
})
export class CreateIdeaModule {}
