import { InitLangService } from './../../init-lang.service';
import { Component, OnInit, RendererFactory2, Renderer2, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as dayjs from 'dayjs';

import { AccountService } from 'app/core/auth/account.service';
import { GeneralService } from 'app/general.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  private renderer: Renderer2;
  ideas: IIdea[];
  subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    private initLangService: InitLangService,
    rootRenderer: RendererFactory2,
    private generalService: GeneralService,
    private pointsDataService: PointsDataService,
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
  }
  ngOnDestroy(): void {
    if (!!this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }

      this.initLangService.changeLanguage();
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });

    this.generalService.queryIdeasByActiveTrue().subscribe(res => {
      this.ideas = res.body;
    });

    if(this.accountService.getAuthenticationState()) {
      this.generalService.findWidthAuthorities().subscribe(u => {
        const user = u.body;

        this.subscription = this.generalService.getPointsFromUser(user.id).subscribe(p => {
          const points = p.body;
          this.pointsDataService.changePoint(points);
        });
      })
    }
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }
}
