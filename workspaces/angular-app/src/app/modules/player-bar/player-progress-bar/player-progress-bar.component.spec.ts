import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerProgressBarComponent } from './player-progress-bar.component';

describe('PlayerProgressBarComponent', () => {
  let component: PlayerProgressBarComponent;
  let fixture: ComponentFixture<PlayerProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
