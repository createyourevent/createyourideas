import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PropertiesComponent } from './list/properties.component';
import { PropertiesDetailComponent } from './detail/properties-detail.component';
import { PropertiesUpdateComponent } from './update/properties-update.component';
import { PropertiesDeleteDialogComponent } from './delete/properties-delete-dialog.component';
import { PropertiesRoutingModule } from './route/properties-routing.module';

@NgModule({
  imports: [SharedModule, PropertiesRoutingModule],
  declarations: [PropertiesComponent, PropertiesDetailComponent, PropertiesUpdateComponent, PropertiesDeleteDialogComponent],
  entryComponents: [PropertiesDeleteDialogComponent],
})
export class PropertiesModule {}
