import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { FindLanguageFromKeyPipe } from './shared/language/find-language-from-key.pipe';

@Injectable({
  providedIn: 'root'
})
export class InitLangService {

constructor(private translateService: TranslateService,
            private sessionStorage: SessionStorageService) {
            }

changeLanguage(): void {
  const lang = navigator.language || window.navigator.language;
  this.sessionStorage.store('locale', lang.substring(0,2));
  this.translateService.use(lang.substring(0,2));
}

}
