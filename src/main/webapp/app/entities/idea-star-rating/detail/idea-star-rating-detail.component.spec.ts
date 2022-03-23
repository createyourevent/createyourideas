import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IdeaStarRatingDetailComponent } from './idea-star-rating-detail.component';

describe('IdeaStarRating Management Detail Component', () => {
  let comp: IdeaStarRatingDetailComponent;
  let fixture: ComponentFixture<IdeaStarRatingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaStarRatingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ideaStarRating: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IdeaStarRatingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IdeaStarRatingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ideaStarRating on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ideaStarRating).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
