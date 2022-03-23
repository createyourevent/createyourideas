import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldKeywordsComponent } from './formly-field-keywords.component';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    ReactiveFormsModule,
    TagInputModule,
    FormsModule,
    FormlyModule.forRoot({
      types: [{ name: 'keywords', component: FormlyFieldKeywordsComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldKeywordsComponent]
})
export class FormlyFieldKeywordsAppModule {}
