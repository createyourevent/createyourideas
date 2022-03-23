import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MonthlyIncomeInvoiceService } from '../service/monthly-income-invoice.service';

import { MonthlyIncomeInvoiceComponent } from './monthly-income-invoice.component';

describe('MonthlyIncomeInvoice Management Component', () => {
  let comp: MonthlyIncomeInvoiceComponent;
  let fixture: ComponentFixture<MonthlyIncomeInvoiceComponent>;
  let service: MonthlyIncomeInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MonthlyIncomeInvoiceComponent],
    })
      .overrideTemplate(MonthlyIncomeInvoiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MonthlyIncomeInvoiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MonthlyIncomeInvoiceService);

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
    expect(comp.monthlyIncomeInvoices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
