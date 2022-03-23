jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MonthlyOutgoingsInvoiceService } from '../service/monthly-outgoings-invoice.service';

import { MonthlyOutgoingsInvoiceDeleteDialogComponent } from './monthly-outgoings-invoice-delete-dialog.component';

describe('MonthlyOutgoingsInvoice Management Delete Component', () => {
  let comp: MonthlyOutgoingsInvoiceDeleteDialogComponent;
  let fixture: ComponentFixture<MonthlyOutgoingsInvoiceDeleteDialogComponent>;
  let service: MonthlyOutgoingsInvoiceService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MonthlyOutgoingsInvoiceDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(MonthlyOutgoingsInvoiceDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MonthlyOutgoingsInvoiceDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MonthlyOutgoingsInvoiceService);
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
