import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PropertiesService } from '../service/properties.service';

import { PropertiesComponent } from './properties.component';

describe('Properties Management Component', () => {
  let comp: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;
  let service: PropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PropertiesComponent],
    })
      .overrideTemplate(PropertiesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PropertiesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PropertiesService);

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
    expect(comp.properties?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
