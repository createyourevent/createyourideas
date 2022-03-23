import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IdeaTransactionIdDetailComponent } from './idea-transaction-id-detail.component';

describe('IdeaTransactionId Management Detail Component', () => {
  let comp: IdeaTransactionIdDetailComponent;
  let fixture: ComponentFixture<IdeaTransactionIdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaTransactionIdDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ideaTransactionId: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IdeaTransactionIdDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IdeaTransactionIdDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ideaTransactionId on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ideaTransactionId).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
