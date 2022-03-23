import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from '../idea.service';
import { GeneralService } from 'app/general.service'
import { IIncome, Income } from 'app/entities/income/income.model';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { IncomeService } from 'app/entities/income/service/income.service';

@Component({
  selector: 'jhi-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.scss']
})
export class IncomesComponent implements OnInit {

  isAdding = false;
  loading: boolean = true;
  idea: IIdea;
  incomes: IIncome[];
  form = new FormGroup({});
  model = {};
  totalIncomes = 0;
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'title',
      type: 'input',
      templateOptions: {
        label: 'Title',
        placeholder: 'Enter title',
        required: true,
      }
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Description',
        placeholder: 'Enter description',
        required: true,
      }
    },
    {
      key: 'date',
      type: 'datetime-local',
      templateOptions: {
        label: 'Date',
        placeholder: 'Enter date',
        required: true,
      }
    },
    {
      key: 'value',
      type: 'input',
      templateOptions: {
        label: 'Value',
        placeholder: 'Enter value',
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

    this.generalService.queryIncomeByIdeaId(this.idea.id).subscribe(incomes => {
      this.incomes = incomes.body;
      this.loading = false;
    });

  }

  onSubmit(model) {
    this.isAdding = true;
    const income: IIncome = new Income(model);
    income.idea = this.idea;
    income.title = model.title;
    income.description = model.description;
    income.date = model.date;
    income.value = model.value;
    this.generalService.createIncome(income).subscribe(() => {
      this.generalService.queryIncomeByIdeaId(this.idea.id).subscribe(incomes => {
        this.incomes = incomes.body;
        this.incomes.forEach(i => {
          this.totalIncomes += i.value;
        });
        this.isAdding = false;
      });
    });
  }

  getTotalIncomes() {
    let incomesTotal = 0;
    this.incomes.forEach(i => {
      incomesTotal += i.value;
    });
    return incomesTotal;
  }

}
