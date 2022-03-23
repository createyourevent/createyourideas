import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormlyFieldTimeComponent } from './formly-field-time.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    FormlyModule.forRoot({
      types: [{ name: 'time', component: FormlyFieldTimeComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldTimeComponent]
})
export class FormlyFieldTimeAppModule {}
