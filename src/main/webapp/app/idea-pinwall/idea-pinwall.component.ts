import { GeneralService } from './../general.service';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { JhiDataUtils } from 'ng-jhipster';
import { ActivatedRoute } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';

@Component({
  selector: 'jhi-idea-pinwall',
  templateUrl: './idea-pinwall.component.html',
  styleUrls: ['idea-pinwall.scss']
})
export class IdeaPinwallComponent implements OnInit {

  configActiveIdeas = {
    displayKey:"title", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
  }

  configInActiveIdeas = {
    displayKey:"title", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
  }

  newIdeas: IIdea[];
  activeIdeas: IIdea[];
  selectedActiveIdea: IIdea;
  selectedInActiveIdea: IIdea;
  donationActive: number;
  donationInActive: number;

  paramId: number = 0;

  selectIdeaForm = this.fb.group({
    ideaName: ['']
  });

  constructor(
    protected ideaService: IdeaService,
    protected dataUtils: JhiDataUtils,
    public fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll(): Promise<boolean> {
    let promise = new Promise<boolean>((resolve, reject) => {
    this.generalService.queryIdeasByActiveTrue().subscribe(ideas => {
      this.activeIdeas = ideas.body;
      this.generalService.queryIdeasByActiveFalse().subscribe(ideas => {
        this.newIdeas = ideas.body;
        resolve(true);
      });
    });
  });
  return promise;
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  onChangeActive(e) {
    this.donationActive = e.value.id;
  }

  onChangeInActive(e) {
    this.donationInActive = e.value.id;
  }
}
