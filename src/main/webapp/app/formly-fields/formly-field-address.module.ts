import { NgModule } from '@angular/core';

import { FormlyModule } from '@ngx-formly/core';
import { FormlyFieldAddressComponent } from './formly-field-address.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

@NgModule({
  imports: [
    ReactiveFormsModule,
    GooglePlaceModule,
    FormsModule,
    FormlyModule.forRoot({
      types: [{ name: 'address', component: FormlyFieldAddressComponent, wrappers: ['form-field'] }]
    }),
    FormlyBootstrapModule
  ],
  declarations: [FormlyFieldAddressComponent]
})
export class FormlyFieldAddressAppModule {}
