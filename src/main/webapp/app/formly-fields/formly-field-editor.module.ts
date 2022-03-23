import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldEditorComponent } from './formly-field-editor.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      types: [
        { name: 'editor',
          component: FormlyFieldEditorComponent,
          wrappers: ['form-field']
        },
      ]
    }),
    FormlyBootstrapModule,
    QuillModule.forRoot()
  ],
  declarations: [FormlyFieldEditorComponent]
})
export class FormlyFieldEditorAppModule {}
