import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SettingsComponent } from './settings.component';
import { settingsRoute } from './settings.route';
import { FormsModule } from '@angular/forms';
import { NgxIbanModule } from "ngx-iban";


@NgModule({
  imports: [SharedModule,
            GooglePlaceModule,
            RouterModule.forChild([settingsRoute]),
            FormsModule,
            NgxIbanModule
          ],
  declarations: [
    SettingsComponent
  ]
})

export class SettingsModule {}
