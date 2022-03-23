import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import * as dayjs from 'dayjs';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { SERVER_API_URL } from './app.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { EntityRoutingModule } from './entities/entity-routing.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { translatePartialLoader, missingTranslationHandler } from './config/translation.config';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HomeAccountingModule } from './accounting/accounting.module';
import { IdeaFunnelModule } from './idea-funnel/idea-funnel.module';
import { HomeIdeaPinwallModule } from './idea-pinwall/idea-pinwall.module';
import { Injector } from '@angular/core';
import { ServiceLocator } from './locale.service';
import { DockerAppsModule } from './views/docker-apps/docker-apps.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardIdeaModule } from './views/idea/dashboard-idea/dashboard-idea.module';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { FormlyFieldCalendar } from './formly-fields/formly-field-primeng-calendar';
import { CalendarModule } from 'primeng/calendar';
import localeDECH from '@angular/common/locales/de-CH';
import { FormlyFieldDateTimeComponent } from './formly-fields/formly-field-datetime.component';
import { FormlyFieldDateTimeAppModule } from './formly-fields/formly-field-datetime.module';
import { PaymentModule } from './views/payment/payment.module';
import { ChatNotificationComponent } from './chat/chat-notification/chat-notification.component';
import { ChatModule } from './chat/chat.module';
import { DashboardConfigIdeaModule } from './views/idea/dashboard-config-idea/dashboard-config-idea.module';
import { StickyNavModule } from 'ng2-sticky-nav';
import { PointsDisplayComponent } from './points/points-display/points-display.component';
import { BaseRateModule } from './views/base_rate/base_rate.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

registerLocaleData(localeDECH);

@NgModule({
  imports: [
    ShareButtonsModule,
    ShareIconsModule,
    BaseRateModule,
    StickyNavModule,
    DashboardConfigIdeaModule,
    ChatModule,
    PaymentModule,
    DashboardIdeaModule,
    RouterModule,
    DockerAppsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    SharedModule,
    IdeaFunnelModule,
    HomeIdeaPinwallModule,
    HomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    EntityRoutingModule,
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
      },
    }),
    NgSelectModule,
    HomeAccountingModule,
    ReactiveFormsModule,
    FormlyFieldDateTimeAppModule,
    FormlyModule.forRoot({
      types: [
        { name: 'datepicker', component: FormlyFieldCalendar }
      ]
    }),
    FormlyPrimeNGModule,
    CalendarModule,
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'de-CH' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'CHF' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent, FormlyFieldCalendar, ChatNotificationComponent, PointsDisplayComponent,],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(
    applicationConfigService: ApplicationConfigService,
    iconLibrary: FaIconLibrary,
    dpConfig: NgbDatepickerConfig,
    translateService: TranslateService,
    private injector: Injector
  ) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
    translateService.setDefaultLang('en');
    translateService.use('en');
    ServiceLocator.injector = this.injector;
  }
}
