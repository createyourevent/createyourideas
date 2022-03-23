import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { WorksheetService } from '../service/worksheet.service';

import { WorksheetComponent } from './worksheet.component';

describe('Worksheet Management Component', () => {
  let comp: WorksheetComponent;
  let fixture: ComponentFixture<WorksheetComponent>;
  let service: WorksheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WorksheetComponent],
    })
      .overrideTemplate(WorksheetComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorksheetComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorksheetService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.worksheets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
