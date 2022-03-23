import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';

import { MonthlyOutgoingsInvoiceComponent } from './monthly-outgoings-invoice.component';

describe('MonthlyOutgoingsInvoice Management Component', () => {
  let comp: MonthlyOutgoingsInvoiceComponent;
  let fixture: ComponentFixture<MonthlyOutgoingsInvoiceComponent>;
  let service: MonthlyOutgoingsInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MonthlyOutgoingsInvoiceComponent],
    })
      .overrideTemplate(MonthlyOutgoingsInvoiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MonthlyOutgoingsInvoiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MonthlyOutgoingsInvoiceService);

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
    expect(comp.monthlyOutgoingsInvoices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
