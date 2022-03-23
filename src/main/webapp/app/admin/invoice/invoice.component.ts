import { Component, OnInit } from '@angular/core';
import { IIdea } from 'app/entities/idea/idea.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {


  ideas: IIdea[];

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.queryIdeasByActiveTrueEagerAll().subscribe(res => {
      this.ideas = res.body;
    });
  }


}
