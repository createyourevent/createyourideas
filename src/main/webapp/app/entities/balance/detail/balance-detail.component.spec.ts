import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BalanceDetailComponent } from './balance-detail.component';

describe('Balance Management Detail Component', () => {
  let comp: BalanceDetailComponent;
  let fixture: ComponentFixture<BalanceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BalanceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ balance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BalanceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BalanceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load balance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.balance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
