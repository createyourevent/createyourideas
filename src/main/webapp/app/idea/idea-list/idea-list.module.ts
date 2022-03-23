import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaListComponent } from './idea-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdeaListRoutes } from './idea-list.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    IdeaListRoutes
  ],
  declarations: [IdeaListComponent]
})
export class IdeaListModule { }
