jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IdeaCommentService } from '../service/idea-comment.service';

import { IdeaCommentDeleteDialogComponent } from './idea-comment-delete-dialog.component';

describe('IdeaComment Management Delete Component', () => {
  let comp: IdeaCommentDeleteDialogComponent;
  let fixture: ComponentFixture<IdeaCommentDeleteDialogComponent>;
  let service: IdeaCommentService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [IdeaCommentDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(IdeaCommentDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IdeaCommentDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IdeaCommentService);
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
