import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-calendar',
  template: `<div style="margin-top:30px;">
    <p-calendar [placeholder]="to.placeholder"
      [class.ng-dirty]="showError"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [minDate] ="minDate"
      >
    </p-calendar></div>
  `,
})
export class FormlyFieldCalendar extends FieldType {
   minDate =  new Date();
}
