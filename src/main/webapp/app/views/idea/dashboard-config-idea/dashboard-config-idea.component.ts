import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { ConfigIdeaService } from './config-idea.service';

@Component({
  selector: 'jhi-dashboard-config-idea',
  templateUrl: './dashboard-config-idea.component.html',
  styleUrls: ['./dashboard-config-idea.component.scss']
})
export class DashboardConfigIdeaComponent implements OnInit {

  idea: IIdea;

  constructor(protected activatedRoute: ActivatedRoute, protected ideaService: ConfigIdeaService,  private router: Router) {
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
