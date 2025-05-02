import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';

if (environment.production) {
	enableProdMode();
}
bootstrapApplication(AppComponent, {
	providers: [provideRouter(appRoutes)],
}).catch((error) => console.error(error));
