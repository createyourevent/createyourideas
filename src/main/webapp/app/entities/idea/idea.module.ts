import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IdeaComponent } from './list/idea.component';
import { IdeaDetailComponent } from './detail/idea-detail.component';
import { IdeaUpdateComponent } from './update/idea-update.component';
import { IdeaDeleteDialogComponent } from './delete/idea-delete-dialog.component';
import { IdeaRoutingModule } from './route/idea-routing.module';

@NgModule({
  imports: [SharedModule, IdeaRoutingModule],
  declarations: [IdeaComponent, IdeaDetailComponent, IdeaUpdateComponent, IdeaDeleteDialogComponent],
  entryComponents: [IdeaDeleteDialogComponent],
})
export class IdeaModule {}
