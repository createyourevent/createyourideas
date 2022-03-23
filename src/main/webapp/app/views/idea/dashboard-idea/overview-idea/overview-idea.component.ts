import { IOutgoings } from './../../../../entities/outgoings/outgoings.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IIncome } from 'app/entities/income/income.model';
import { IdeaService } from '../idea.service';
import { IBalance } from 'app/entities/balance/balance.model';

@Component({
  selector: 'jhi-overview-idea',
  templateUrl: './overview-idea.component.html',
  styleUrls: ['./overview-idea.component.scss']
})
export class OverviewIdeaComponent implements OnInit {


  incomes: IIncome[];
  outgoings: IOutgoings[];

  balances: IBalance[];


  loading: boolean = true;

  data: {};

  idea: IIdea;
  constructor(protected activatedRoute: ActivatedRoute, protected ideaService: IdeaService) { }

  ngOnInit() {
    this.idea = this.ideaService.idea;
    this.incomes = this.idea.incomes;
    this.outgoings = this.idea.outgoings;
    this.balances = this.idea.balances;
    this.loading = false;

  }
}
