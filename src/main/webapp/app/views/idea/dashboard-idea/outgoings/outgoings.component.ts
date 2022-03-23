import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from '../idea.service';
import { GeneralService } from 'app/general.service'
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import { OutgoingsService } from 'app/entities/outgoings/service/outgoings.service';
import { IOutgoings, Outgoings } from 'app/entities/outgoings/outgoings.model';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-incomes',
  templateUrl: './outgoings.component.html',
  styleUrls: ['./outgoings.component.scss']
})
export class OutgoingsComponent implements OnInit {

  loading: boolean = true;
  isAdding = false;
  idea: IIdea;
  outgoings: IOutgoings[];
  form = new FormGroup({});
  model = {};
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
              protected outgoingsService: OutgoingsService,) { }

  ngOnInit() {
    this.idea = this.ideaService.idea;

    this.generalService.queryOutgoingByIdeaId(this.idea.id).subscribe(outgoings => {
      this.outgoings = outgoings.body;
      this.loading = false;
    });

  }

  onSubmit(model) {
    this.isAdding = true;
    const outgoing: IOutgoings = new Outgoings(model);
    outgoing.idea = this.idea;
    outgoing.title = model.title;
    outgoing.description = model.description;
    outgoing.date = dayjs(model.date);
    outgoing.value = model.value;
    this.generalService.createOutgoing(outgoing).subscribe(() => {
      this.generalService.queryOutgoingByIdeaId(this.idea.id).subscribe(outgoings => {
        this.outgoings = outgoings.body;
        this.isAdding = false;
      });
    });

  }

  getTotalOutgoings() {
    let outgoingsTotal = 0;
    this.outgoings.forEach(o => {
      outgoingsTotal += o.value;
    });
    return outgoingsTotal;
  }

}
