import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';

import { IdeaTransactionIdComponent } from './idea-transaction-id.component';

describe('IdeaTransactionId Management Component', () => {
  let comp: IdeaTransactionIdComponent;
  let fixture: ComponentFixture<IdeaTransactionIdComponent>;
  let service: IdeaTransactionIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaTransactionIdComponent],
    })
      .overrideTemplate(IdeaTransactionIdComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdeaTransactionIdComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IdeaTransactionIdService);

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
    expect(comp.ideaTransactionIds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
