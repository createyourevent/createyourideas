import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserPointAssociationService } from '../service/user-point-association.service';

import { UserPointAssociationComponent } from './user-point-association.component';

describe('UserPointAssociation Management Component', () => {
  let comp: UserPointAssociationComponent;
  let fixture: ComponentFixture<UserPointAssociationComponent>;
  let service: UserPointAssociationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserPointAssociationComponent],
    })
      .overrideTemplate(UserPointAssociationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPointAssociationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserPointAssociationService);

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
    expect(comp.userPointAssociations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
