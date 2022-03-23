import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from './idea.service';


@Component({
  selector: 'jhi-dashboard-idea',
  templateUrl: './dashboard-idea.component.html',
  styleUrls: ['./dashboard-idea.component.scss']
})
export class DashboardIdeaComponent implements OnInit {

  idea: IIdea;

  constructor(protected activatedRoute: ActivatedRoute, protected ideaService: IdeaService,  private router: Router) {
  }


  ngOnInit() {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
      this.ideaService.idea = idea;
    });
  }

  back() {
    this.router.navigate(['/my-ideas']);
  }


}
