import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OutgoingsDetailComponent } from './outgoings-detail.component';

describe('Outgoings Management Detail Component', () => {
  let comp: OutgoingsDetailComponent;
  let fixture: ComponentFixture<OutgoingsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutgoingsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ outgoings: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OutgoingsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OutgoingsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load outgoings on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.outgoings).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
