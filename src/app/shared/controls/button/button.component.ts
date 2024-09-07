import { Component, input } from '@angular/core';
import { PaletteColor } from '../../../models/design-model';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  color = input<PaletteColor>('primary');

  get colorClass(): string {
    return `button-${this.color()}`;
  }
}
