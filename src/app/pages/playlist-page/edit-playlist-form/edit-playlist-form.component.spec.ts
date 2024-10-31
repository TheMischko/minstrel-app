import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlaylistFormComponent } from './edit-playlist-form.component';

describe('EditPlaylistFormComponent', () => {
  let component: EditPlaylistFormComponent;
  let fixture: ComponentFixture<EditPlaylistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlaylistFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPlaylistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
