import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'formly-field-custom-input',
  template: `
<label for="{{id}}">
    <span>{{to.label}}</span>
        {{to.required ? '*' : ''}}
    </label>
    <quill-editor [styles]="{height: '350px'}" id="{{id}}" [placeholder]="to.placeholder" [formControl]="formControl" [formlyAttributes]="field" [class.is-invalid]="showError" [style]="{'height':'400px'}" [modules]="modules" (onEditorCreated)="getEditorInstance($event)"></quill-editor>
    <input type="file" style="display: none" id="fileInputField"/>
    <small class="form-text text-muted">{{ to.description }}</small>
  `,
  providers: [MessageService],
})
export class FieldQuillType extends FieldType {

  modules = {};

  quillEditorRef: any;
  maxUploadFileSize = 500000;

  constructor( private messageService: MessageService, private translate: TranslateService) {
      super();
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ['clean'], // remove formatting button

        ['link', 'image', 'video'], // link and image, video
      ]
    };
  }

  getEditorInstance(editorInstance: any): void {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

   imageHandler = (image: any, callback: any) => {
     const input = <HTMLInputElement> document.getElementById('fileInputField');
     document.getElementById('fileInputField').onchange = () => {
       const file: File = input.files[0];
       // file type is only image.
       if (/^image\//.test(file.type)) {
         if (file.size > this.maxUploadFileSize) {
          this.messageService.add({severity:'error', summary: this.translate.instant('register-shop.filesize.error'), detail: this.translate.instant('register-shop.filesize.error.info')});
         } else {
           const reader  = new FileReader();
           reader.onload = () =>  {
             const range = this.quillEditorRef.getSelection();
             const img = '<img src="' + reader.result + '" />';
             this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, img);
           };
           reader.readAsDataURL(file);
         }
       } else {
          this.messageService.add({severity:'error', summary: this.translate.instant('register-shop.filetype.error'), detail: this.translate.instant('register-shop.filetype.error.info')});
       }
     };
     input.click();
   }

}
