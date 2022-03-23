import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProfitBalanceDetailComponent } from './profit-balance-detail.component';

describe('ProfitBalance Management Detail Component', () => {
  let comp: ProfitBalanceDetailComponent;
  let fixture: ComponentFixture<ProfitBalanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfitBalanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ profitBalance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProfitBalanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProfitBalanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load profitBalance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.profitBalance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
