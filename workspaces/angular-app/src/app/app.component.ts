import { Component } from '@angular/core';
import { MenuBarComponent } from './modules/menu-bar/menu-bar.component';
import { SideBarComponent } from './modules/side-bar/side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MenuBarComponent, SideBarComponent, RouterOutlet]
})
export class AppComponent {
	title = 'electron-angular-quick-start';
}
