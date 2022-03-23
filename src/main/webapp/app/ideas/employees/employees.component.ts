import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'app/entities/employee/employee.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { GeneralService } from 'app/general.service';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'jhi-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {


  employees: Employee[] = [];
  loading: boolean = true;
  idea: IIdea;

  chartData: TreeNode[];

  constructor(private generalService: GeneralService, protected activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
      this.employees = idea.employees;
      this.loading = false;
      this.chartData = [{
        label: 'Company',
        type: 'person',
        styleClass: 'p-person',
        expanded: true,
        data: {name: this.idea.title, avatar: 'data:' + idea.logoContentType + ';base64,' + idea.logo},
        children: []
      }];

      this.employees.forEach(emp => {
        const employee = {
            label: 'Employee',
            type: 'person',
            styleClass: 'p-person',
            expanded: true,
            data: {name: emp.user.firstName + ' ' + emp.user.lastName, avatar: 'data:' + idea.logoContentType + ';base64,' + idea.logo}
        };
        this.chartData[0].children.push(employee);
      });

    });
  }

}
