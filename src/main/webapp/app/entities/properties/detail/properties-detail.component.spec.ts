import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PropertiesDetailComponent } from './properties-detail.component';

describe('Properties Management Detail Component', () => {
  let comp: PropertiesDetailComponent;
  let fixture: ComponentFixture<PropertiesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ properties: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PropertiesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PropertiesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load properties on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.properties).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
