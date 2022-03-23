import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IdeaLikeDislikeDetailComponent } from './idea-like-dislike-detail.component';

describe('IdeaLikeDislike Management Detail Component', () => {
  let comp: IdeaLikeDislikeDetailComponent;
  let fixture: ComponentFixture<IdeaLikeDislikeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaLikeDislikeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ideaLikeDislike: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IdeaLikeDislikeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IdeaLikeDislikeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ideaLikeDislike on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ideaLikeDislike).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
