import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IdeaCommentDetailComponent } from './idea-comment-detail.component';

describe('IdeaComment Management Detail Component', () => {
  let comp: IdeaCommentDetailComponent;
  let fixture: ComponentFixture<IdeaCommentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IdeaCommentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ideaComment: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IdeaCommentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IdeaCommentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ideaComment on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ideaComment).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
