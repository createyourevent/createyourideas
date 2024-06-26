jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IdeaTransactionIdService } from '../service/idea-transaction-id.service';

import { IdeaTransactionIdDeleteDialogComponent } from './idea-transaction-id-delete-dialog.component';

describe('IdeaTransactionId Management Delete Component', () => {
  let comp: IdeaTransactionIdDeleteDialogComponent;
  let fixture: ComponentFixture<IdeaTransactionIdDeleteDialogComponent>;
  let service: IdeaTransactionIdService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaTransactionIdDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(IdeaTransactionIdDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IdeaTransactionIdDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IdeaTransactionIdService);
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
