import { IdeaTransactionIdService } from './../entities/idea-transaction-id/service/idea-transaction-id.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Donation, IDonation } from 'app/entities/donation/donation.model';
import { DonationService } from 'app/entities/donation/service/donation.service';
import { IdeaTransactionId, IIdeaTransactionId } from 'app/entities/idea-transaction-id/idea-transaction-id.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit {

  idea: IIdea;
  value: number;
  donations: IDonation[];

  type: string;
  id: number;
  txId: string;
  refNo: string;

  user: IUser;

  loading: boolean = true;

  constructor(protected activatedRoute: ActivatedRoute,
              private generalService: GeneralService,
              protected router: Router,
              private donationService: DonationService,
              private ideaTransactionService: IdeaTransactionIdService,
              private ideaService: IdeaService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
      this.type = 'idea';
      this.id = this.idea.id;
      this.donations = idea.donations;
      this.loading = false;
    });

    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.txId = params['txId'];
      this.refNo = params['refNo'];

      if(this.txId) {
        this.generalService.getStatusFromTransactionIdFromDatatrans(this.txId).subscribe(res => {
          const z = res.body;
          if(z.status === "authorized" || z.status === "settled") {
            const donation: IDonation = new Donation();
            donation.idea = this.idea;
            donation.user = this.user;
            donation.date = dayjs();
            const txId: IIdeaTransactionId = new IdeaTransactionId();
            txId.idea = this.idea;
            txId.refNo = this.refNo;
            txId.transactionId = this.txId;
            this.ideaTransactionService.create(txId).subscribe(t => {
              donation.txId = t.body;
              donation.amount = Number(z.detail.settle.amount)/100;
              this.donationService.create(donation).subscribe(i => {
                this.idea.donations.push(i.body);
                this.ideaService.update(this.idea).subscribe();
              });
            });
          }
        });
      }
    });
  }

  genround(amt: number, prec: number): number {
    var rndd = Number((Math.round(amt / prec) * prec).toFixed(2));
    return rndd ;
  }

  previousState(): void {
    window.history.back();
  }

  donate(value: number) {
    this.value = value;
  }

}
