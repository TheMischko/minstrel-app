import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      <!--      <div class="parchment" [class.border]="showBorder"></div>-->
      <div class="content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './container.component.scss',
})
export class ContainerComponent {
  @Input() showBorder: boolean = true;
}
