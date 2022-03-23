import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application, IApplication } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/service/application.service';
import { Employee, IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss']
})
export class EmployeeManagementComponent implements OnInit {


  idea: IIdea;
  employees: IEmployee[];
  applications: IApplication[];

  loading: boolean = true;
  user: IUser;
  employee: IEmployee;

  constructor(private generalService: GeneralService,
              protected activatedRoute: ActivatedRoute,
              private applicationService: ApplicationService,
              private employeeService: EmployeeService,
              private ideaService: IdeaService,
              private cdr: ChangeDetectorRef
              ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.user = u.body;
        this.generalService.queryEmployeeByUserId(this.user.id).subscribe(e => {
          this.employee = e.body;
          this.idea = idea;
          this.employees = idea.employees;
          this.applications = idea.applications;
          this.loading = false;
        });
      });
    });
  }

  handleSeen(e, application: IApplication): void {
    application.seen = e.checked;
    this.applicationService.partialUpdate(application).subscribe();
  }

  handleResponded(e, application) {
    application.responded = e.value;
    application.date = dayjs(application.date);
    this.applicationService.partialUpdate(application).subscribe();
    if(application.responded === true) {
      this.generalService.queryEmployeeByUserId(application.user.id).subscribe(e => {
        if(e.body.ideas === null) {
          e.body.ideas = [];
        }
        e.body.ideas.push(this.idea);
        e.body.date = dayjs(e.body.date);
        this.employeeService.update(e.body).subscribe(eu => {
          this.idea.employees.push(eu.body);
          this.ideaService.update(this.idea).subscribe();
        });
      });
    } else if(application.responded === null || application.responded === false)
      this.fire(this.user);
  }

  fire(user: IUser) {

      this.generalService.queryIdeasByActiveTrueEagerEmployeesApplications(this.idea.id).subscribe(idea => {
        this.idea = idea.body;
        this.employees = this.idea.employees;
        const app = this.idea.applications.find(x => x.user.id === user.id);
        app.responded = false;
        app.date = dayjs(app.date);
        this.applicationService.partialUpdate(app).subscribe(res => {
          const found = this.idea.applications.findIndex(x => res.body.id === x.id);
          this.idea.applications.splice(found, 1);
          this.idea.applications.push(app);
          this.applications = this.idea.applications;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      });
  }

}
