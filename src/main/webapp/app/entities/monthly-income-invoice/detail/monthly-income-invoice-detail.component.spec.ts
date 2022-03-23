import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MonthlyIncomeInvoiceDetailComponent } from './monthly-income-invoice-detail.component';

describe('MonthlyIncomeInvoice Management Detail Component', () => {
  let comp: MonthlyIncomeInvoiceDetailComponent;
  let fixture: ComponentFixture<MonthlyIncomeInvoiceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyIncomeInvoiceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ monthlyIncomeInvoice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MonthlyIncomeInvoiceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MonthlyIncomeInvoiceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load monthlyIncomeInvoice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.monthlyIncomeInvoice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
