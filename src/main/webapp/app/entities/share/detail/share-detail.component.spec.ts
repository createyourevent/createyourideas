import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShareDetailComponent } from './share-detail.component';

describe('Share Management Detail Component', () => {
  let comp: ShareDetailComponent;
  let fixture: ComponentFixture<ShareDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ share: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShareDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShareDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load share on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.share).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
