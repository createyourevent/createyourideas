import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MonthlyOutgoingsInvoiceDetailComponent } from './monthly-outgoings-invoice-detail.component';

describe('MonthlyOutgoingsInvoice Management Detail Component', () => {
  let comp: MonthlyOutgoingsInvoiceDetailComponent;
  let fixture: ComponentFixture<MonthlyOutgoingsInvoiceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyOutgoingsInvoiceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ monthlyOutgoingsInvoice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MonthlyOutgoingsInvoiceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MonthlyOutgoingsInvoiceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load monthlyOutgoingsInvoice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.monthlyOutgoingsInvoice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
