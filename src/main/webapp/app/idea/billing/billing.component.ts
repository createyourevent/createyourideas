import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IOutgoings } from 'app/entities/outgoings/outgoings.model';

@Component({
  selector: 'jhi-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {


  idea: IIdea;
  parentIdea: IIdea;

  allInterestToParent: IOutgoings[] = [];
  allInterestToParentTotal = 0;

  allDistributionsToChild: IOutgoings[] = [];
  allDistributionsToChildTotal = 0;

  constructor(protected activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
      this.parentIdea = this.idea.idea;

      this.idea.outgoings.forEach(o => {
       if(o.toChildIdea === false && o.auto === true) {
          this.allInterestToParent.push(o);
          this.allInterestToParentTotal += o.value;
       }
       if(o.toChildIdea === true && o.auto === true) {
          this.allDistributionsToChild.push(o);
          this.allDistributionsToChildTotal += o.value;
       }
      });

    });
  }

}
