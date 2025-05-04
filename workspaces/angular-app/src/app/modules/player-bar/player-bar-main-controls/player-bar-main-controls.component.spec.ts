import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBarMainControlsComponent } from './player-bar-main-controls.component';

describe('PlayerBarMainControlsComponent', () => {
  let component: PlayerBarMainControlsComponent;
  let fixture: ComponentFixture<PlayerBarMainControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerBarMainControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerBarMainControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
