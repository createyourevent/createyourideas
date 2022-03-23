import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IdeaTransactionIdComponent } from './list/idea-transaction-id.component';
import { IdeaTransactionIdDetailComponent } from './detail/idea-transaction-id-detail.component';
import { IdeaTransactionIdUpdateComponent } from './update/idea-transaction-id-update.component';
import { IdeaTransactionIdDeleteDialogComponent } from './delete/idea-transaction-id-delete-dialog.component';
import { IdeaTransactionIdRoutingModule } from './route/idea-transaction-id-routing.module';

@NgModule({
  imports: [SharedModule, IdeaTransactionIdRoutingModule],
  declarations: [
    IdeaTransactionIdComponent,
    IdeaTransactionIdDetailComponent,
    IdeaTransactionIdUpdateComponent,
    IdeaTransactionIdDeleteDialogComponent,
  ],
  entryComponents: [IdeaTransactionIdDeleteDialogComponent],
})
export class IdeaTransactionIdModule {}
