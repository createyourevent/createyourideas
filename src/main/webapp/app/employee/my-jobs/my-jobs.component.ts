import { Component, OnInit } from '@angular/core';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.scss']
})
export class MyJobsComponent implements OnInit {

  user: IUser;
  ideas: IIdea[] = [];

  loading: boolean = true;

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.generalService.queryIdeasByActiveTrueEagerAll().subscribe(is => {
        const ideas = is.body;
        let i = 0;
        ideas.forEach(ele => {
          i++;
          const found = ele.employees.findIndex(e => e.user.id === this.user.id);
          if(found >= 0) {
            this.ideas.push(ele);
          }
          if(ideas.length === i) {
            this.loading = false;
          }
        });
      });
    });
  }

}
