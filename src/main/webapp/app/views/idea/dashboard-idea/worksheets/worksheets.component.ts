import { IWorksheet, Worksheet } from './../../../../entities/worksheet/worksheet.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from '../idea.service';
import { GeneralService } from 'app/general.service'
import { IIncome, Income } from 'app/entities/income/income.model';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { IncomeService } from 'app/entities/income/service/income.service';
import { IUser } from 'app/entities/user/user.model';
import dayjs from 'dayjs';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IEmployee } from 'app/entities/employee/employee.model';

@Component({
  selector: 'jhi-worksheets',
  templateUrl: './worksheets.component.html',
  styleUrls: ['./worksheets.component.scss']
})
export class WorksheetsComponent implements OnInit {

  isAdding = false;
  loading: boolean = true;
  idea: IIdea;
  user: IUser;
  employee: IEmployee;
  worksheets: IWorksheet[] = [];
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'jobtitle',
      type: 'input',
      templateOptions: {
        label: 'Job title',
        placeholder: 'Enter job title',
        required: true,
      }
    },
    {
      key: 'jobdescription',
      type: 'textarea',
      templateOptions: {
        label: 'Job description',
        placeholder: 'Enter job description',
        required: true,
      }
    },
    {
      key: 'dateStart',
      type: 'datetime-local',
      templateOptions: {
        label: 'Date start',
        placeholder: 'Enter date start',
        required: true,
      }
    },
    {
      key: 'dateEnd',
      type: 'datetime-local',
      templateOptions: {
        label: 'Date end',
        placeholder: 'Enter date end',
        required: true,
      }
    },
    {
      key: 'costHour',
      type: 'input',
      templateOptions: {
        label: 'Cost per hour',
        placeholder: 'Enter cost per hour',
        required: true,
      }
    }
  ];


  constructor(protected activatedRoute: ActivatedRoute,
              protected ideaService: IdeaService,
              protected generalService: GeneralService,
              protected incomeService: IncomeService,) { }

  ngOnInit() {
    this.idea = this.ideaService.idea;

    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.generalService.queryEmployeeByUserId(this.user.id).subscribe(e => {
        this.employee = e.body;
      });
    });

    this.generalService.queryWorksheetByIdeaId(this.idea.id).subscribe(incomes => {
      this.worksheets = incomes.body;
      this.loading = false;
    });

  }

  onSubmit(model) {
    this.isAdding = true;
    const worksheet: IWorksheet = new Worksheet(model);
    worksheet.idea = this.idea;
    worksheet.employee = this.employee;
    worksheet.jobtitle = model.jobtitle;
    worksheet.jobdescription = model.jobdescription;
    worksheet.dateStart = model.dateStart;
    worksheet.dateEnd = model.dateEnd;
    worksheet.costHour = model.costHour;
    worksheet.total = dayjs(worksheet.dateEnd).diff(dayjs(worksheet.dateStart), 'minute') * (worksheet.costHour/60);
    this.generalService.createWorksheet(worksheet).subscribe(() => {
      this.generalService.queryWorksheetByIdeaId(this.idea.id).subscribe(incomes => {
        this.worksheets = incomes.body;
        this.isAdding = false;
      });
    });
  }

  getTotalWorksheets() {
    let worksheetsTotal = 0;
      this.worksheets.forEach(i => {
        worksheetsTotal += i.total;
      });
    return worksheetsTotal;
  }

}
