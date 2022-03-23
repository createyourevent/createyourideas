import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OutgoingsComponent } from './list/outgoings.component';
import { OutgoingsDetailComponent } from './detail/outgoings-detail.component';
import { OutgoingsUpdateComponent } from './update/outgoings-update.component';
import { OutgoingsDeleteDialogComponent } from './delete/outgoings-delete-dialog.component';
import { OutgoingsRoutingModule } from './route/outgoings-routing.module';

@NgModule({
  imports: [SharedModule, OutgoingsRoutingModule],
  declarations: [OutgoingsComponent, OutgoingsDetailComponent, OutgoingsUpdateComponent, OutgoingsDeleteDialogComponent],
  entryComponents: [OutgoingsDeleteDialogComponent],
})
export class OutgoingsModule {}
