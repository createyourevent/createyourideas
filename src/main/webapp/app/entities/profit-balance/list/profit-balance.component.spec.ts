import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProfitBalanceService } from '../service/profit-balance.service';

import { ProfitBalanceComponent } from './profit-balance.component';

describe('ProfitBalance Management Component', () => {
  let comp: ProfitBalanceComponent;
  let fixture: ComponentFixture<ProfitBalanceComponent>;
  let service: ProfitBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProfitBalanceComponent],
    })
      .overrideTemplate(ProfitBalanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfitBalanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProfitBalanceService);

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
    expect(comp.profitBalances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
