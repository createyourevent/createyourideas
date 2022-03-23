import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IdeaStarRatingService } from '../service/idea-star-rating.service';

import { IdeaStarRatingComponent } from './idea-star-rating.component';

describe('IdeaStarRating Management Component', () => {
  let comp: IdeaStarRatingComponent;
  let fixture: ComponentFixture<IdeaStarRatingComponent>;
  let service: IdeaStarRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaStarRatingComponent],
    })
      .overrideTemplate(IdeaStarRatingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaStarRatingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IdeaStarRatingService);

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
    expect(comp.ideaStarRatings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
