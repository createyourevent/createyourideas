import { Component, OnInit } from '@angular/core';
import { IDonation } from 'app/entities/donation/donation.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from '../idea.service';

@Component({
  selector: 'jhi-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {

  idea: IIdea;
  donations: IDonation[];
  loading: boolean = true;

  constructor(protected ideaService: IdeaService,) { }

  ngOnInit() {
    this.idea = this.ideaService.idea;
    this.donations = this.idea.donations;
    this.loading = false;
  }

  getTotalDonations() {
    let donationsTotal = 0;
      this.donations.forEach(i => {
        donationsTotal += i.amount;
      });
    return donationsTotal;
  }

}
