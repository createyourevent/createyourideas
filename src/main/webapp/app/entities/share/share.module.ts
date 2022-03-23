import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShareComponent } from './list/share.component';
import { ShareDetailComponent } from './detail/share-detail.component';
import { ShareUpdateComponent } from './update/share-update.component';
import { ShareDeleteDialogComponent } from './delete/share-delete-dialog.component';
import { ShareRoutingModule } from './route/share-routing.module';

@NgModule({
  imports: [SharedModule, ShareRoutingModule],
  declarations: [ShareComponent, ShareDetailComponent, ShareUpdateComponent, ShareDeleteDialogComponent],
  entryComponents: [ShareDeleteDialogComponent],
})
export class ShareModule {}
