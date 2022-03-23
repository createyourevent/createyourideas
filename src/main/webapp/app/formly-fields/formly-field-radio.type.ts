import  { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
 selector: 'formly-field-radio',
 template: `
  <div *ngFor="let option of to.options">
    <input type="radio"
           [name]="to.name"
           [formControl]="formControl"
           [formlyAttributes]="field"
           [value]="option.key">
    {{ option.value }}
  </div>
 `,
})
export class FormlyFieldRadio extends FieldType {}
