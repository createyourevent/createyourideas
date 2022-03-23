import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IdeaLikeDislikeService } from '../service/idea-like-dislike.service';

import { IdeaLikeDislikeComponent } from './idea-like-dislike.component';

describe('IdeaLikeDislike Management Component', () => {
  let comp: IdeaLikeDislikeComponent;
  let fixture: ComponentFixture<IdeaLikeDislikeComponent>;
  let service: IdeaLikeDislikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaLikeDislikeComponent],
    })
      .overrideTemplate(IdeaLikeDislikeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaLikeDislikeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IdeaLikeDislikeService);

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
    expect(comp.ideaLikeDislikes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
