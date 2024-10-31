import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { Router, RouterOutlet } from '@angular/router';
import { ElectronService } from './services/electron.service';
import { ipcRenderer } from 'electron';
import { ButtonComponent } from './shared/controls/button/button.component';
import { ContainerComponent } from './shared/container/container.component';
import { SidePanelComponent } from './layout/side-panel/side-panel.component';
import { ElectronOperation } from './models/electron-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonComponent,
    ContainerComponent,
    SidePanelComponent,
  ],
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  sendSetup() {
    ipcRenderer.send('setup');
  }

  sendPlay() {
    ipcRenderer.send('play');
  }

  sendPause() {
    ipcRenderer.send('play-second');
  }

  getPlaylists() {
    this.router.navigate(['playlist']);
    return;
  }
}
