import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ApplicationService } from '../service/application.service';

import { ApplicationComponent } from './application.component';

describe('Application Management Component', () => {
  let comp: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;
  let service: ApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ApplicationComponent],
    })
      .overrideTemplate(ApplicationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ApplicationService);

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
    expect(comp.applications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
