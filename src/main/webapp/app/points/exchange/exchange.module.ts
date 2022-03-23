import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeComponent } from './exchange.component';
import { SharedModule } from 'app/shared/shared.module';
import { ExchangeRoutes } from './exchange.routing';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [CommonModule, SharedModule, ExchangeRoutes, CarouselModule, CardModule, ButtonModule, ToastModule],
  declarations: [ExchangeComponent]
})
export class ExchangeModule {}
