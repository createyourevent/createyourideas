import { IBalance } from 'app/entities/balance/balance.model';
import { Component, OnInit } from '@angular/core';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  account: Account | null = null;
  ideas: IIdea[];
  responsiveOptions = [];
  basicOptions: any;


  constructor(private accountService: AccountService, private loginService: LoginService, private generalService: GeneralService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.account = account));
    this.generalService.queryIdeasByActiveTrue().subscribe(e => {
      this.ideas = e.body;
    });
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
          }
      };
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginService.login();
  }
}
