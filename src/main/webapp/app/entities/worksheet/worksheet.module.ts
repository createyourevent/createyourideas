import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorksheetComponent } from './list/worksheet.component';
import { WorksheetDetailComponent } from './detail/worksheet-detail.component';
import { WorksheetUpdateComponent } from './update/worksheet-update.component';
import { WorksheetDeleteDialogComponent } from './delete/worksheet-delete-dialog.component';
import { WorksheetRoutingModule } from './route/worksheet-routing.module';

@NgModule({
  imports: [SharedModule, WorksheetRoutingModule],
  declarations: [WorksheetComponent, WorksheetDetailComponent, WorksheetUpdateComponent, WorksheetDeleteDialogComponent],
  entryComponents: [WorksheetDeleteDialogComponent],
})
export class WorksheetModule {}
