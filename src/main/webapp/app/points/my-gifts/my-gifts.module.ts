import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyGiftsComponent } from './my-gifts.component';
import { SharedModule } from 'app/shared/shared.module';
import { MyGiftsRoutes } from './my-gifts.routing';
import { CardModule } from 'primeng/card';


@NgModule({
  imports: [CommonModule, MyGiftsRoutes, SharedModule, CardModule],
  declarations: [MyGiftsComponent]
})
export class MyGiftsModule {}
