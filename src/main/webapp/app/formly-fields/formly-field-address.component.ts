import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'jhi-formly-field-address',
  templateUrl: './formly-field-address.component.html'
})
export class FormlyFieldAddressComponent extends FieldType {
  formattedaddress = '';

  public addressChange(address: any): void {
    this.formattedaddress = address.formatted_address;
    this.field.formControl!.setValue(address.formatted_address);
  }
}
