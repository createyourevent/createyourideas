jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserPointAssociationService } from '../service/user-point-association.service';

import { UserPointAssociationDeleteDialogComponent } from './user-point-association-delete-dialog.component';

describe('UserPointAssociation Management Delete Component', () => {
  let comp: UserPointAssociationDeleteDialogComponent;
  let fixture: ComponentFixture<UserPointAssociationDeleteDialogComponent>;
  let service: UserPointAssociationService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserPointAssociationDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(UserPointAssociationDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserPointAssociationDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserPointAssociationService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
