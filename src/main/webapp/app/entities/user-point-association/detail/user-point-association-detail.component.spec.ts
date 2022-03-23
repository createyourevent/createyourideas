import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserPointAssociationDetailComponent } from './user-point-association-detail.component';

describe('UserPointAssociation Management Detail Component', () => {
  let comp: UserPointAssociationDetailComponent;
  let fixture: ComponentFixture<UserPointAssociationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPointAssociationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userPointAssociation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserPointAssociationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserPointAssociationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userPointAssociation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userPointAssociation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
