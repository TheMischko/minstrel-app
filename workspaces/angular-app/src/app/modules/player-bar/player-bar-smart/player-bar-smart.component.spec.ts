import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBarSmartComponent } from './player-bar-smart.component';

describe('PlayerBarSmartComponent', () => {
  let component: PlayerBarSmartComponent;
  let fixture: ComponentFixture<PlayerBarSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerBarSmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerBarSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
