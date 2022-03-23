import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ShareService } from '../service/share.service';

import { ShareComponent } from './share.component';

describe('Share Management Component', () => {
  let comp: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;
  let service: ShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShareComponent],
    })
      .overrideTemplate(ShareComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShareComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShareService);

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
    expect(comp.shares?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
