import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserPointAssociationComponent } from './list/user-point-association.component';
import { UserPointAssociationDetailComponent } from './detail/user-point-association-detail.component';
import { UserPointAssociationUpdateComponent } from './update/user-point-association-update.component';
import { UserPointAssociationDeleteDialogComponent } from './delete/user-point-association-delete-dialog.component';
import { UserPointAssociationRoutingModule } from './route/user-point-association-routing.module';

@NgModule({
  imports: [SharedModule, UserPointAssociationRoutingModule],
  declarations: [
    UserPointAssociationComponent,
    UserPointAssociationDetailComponent,
    UserPointAssociationUpdateComponent,
    UserPointAssociationDeleteDialogComponent,
  ],
  entryComponents: [UserPointAssociationDeleteDialogComponent],
})
export class UserPointAssociationModule {}
