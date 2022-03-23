import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {

  ideas: IIdea[];
  selectedIdea: IIdea;

  selectIdeaForm = this.fb.group({
    ideaName: ['']
  });

  constructor(
    protected ideaService: IdeaService,
    public fb: FormBuilder
  ) {}

  loadSelect() {
    /*
	  this.ideaService.queryByUser().subscribe((res: HttpResponse<IIdea[]>) => {
          this.ideas = res.body

    });
    */
  }

  changeIdea() {
    this.ideaService.find(parseInt(this.selectIdeaForm.get("ideaName").value, 10)).subscribe((res: HttpResponse<IIdea>) =>
      { this.selectedIdea = res.body;
      })
  }

  ngOnInit() {
    this.loadSelect();
  }

}
