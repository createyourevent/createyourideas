import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProperties, Properties } from '../properties.model';
import { PropertiesService } from '../service/properties.service';

@Component({
  selector: 'jhi-properties-update',
  templateUrl: './properties-update.component.html',
})
export class PropertiesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    key: [],
    value: [],
  });

  constructor(protected propertiesService: PropertiesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ properties }) => {
      this.updateForm(properties);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const properties = this.createFromForm();
    if (properties.id !== undefined) {
      this.subscribeToSaveResponse(this.propertiesService.update(properties));
    } else {
      this.subscribeToSaveResponse(this.propertiesService.create(properties));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProperties>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(properties: IProperties): void {
    this.editForm.patchValue({
      id: properties.id,
      key: properties.key,
      value: properties.value,
    });
  }

  protected createFromForm(): IProperties {
    return {
      ...new Properties(),
      id: this.editForm.get(['id'])!.value,
      key: this.editForm.get(['key'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
