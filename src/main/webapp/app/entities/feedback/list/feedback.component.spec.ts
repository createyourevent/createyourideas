import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FeedbackService } from '../service/feedback.service';

import { FeedbackComponent } from './feedback.component';

describe('Feedback Management Component', () => {
  let comp: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FeedbackComponent],
    })
      .overrideTemplate(FeedbackComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FeedbackService);

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
    expect(comp.feedbacks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
