import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DonationDetailComponent } from './donation-detail.component';

describe('Donation Management Detail Component', () => {
  let comp: DonationDetailComponent;
  let fixture: ComponentFixture<DonationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ donation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DonationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DonationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load donation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.donation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
