import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelOfFortuneComponent } from './wheelOfFortune.component';
import { WheelOfFortuneRoutes } from './wheelOfFortune.routing';
import { LuckySpinModule } from 'app/views/games/luckySpin/luckySpin.module';

@NgModule({
  imports: [
    CommonModule,
    WheelOfFortuneRoutes,
    LuckySpinModule
  ],
  declarations: [WheelOfFortuneComponent]
})
export class WheelOfFortuneModule { }
