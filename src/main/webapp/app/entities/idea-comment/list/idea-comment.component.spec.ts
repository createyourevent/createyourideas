import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IdeaCommentService } from '../service/idea-comment.service';

import { IdeaCommentComponent } from './idea-comment.component';

describe('IdeaComment Management Component', () => {
  let comp: IdeaCommentComponent;
  let fixture: ComponentFixture<IdeaCommentComponent>;
  let service: IdeaCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaCommentComponent],
    })
      .overrideTemplate(IdeaCommentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaCommentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IdeaCommentService);

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
    expect(comp.ideaComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
