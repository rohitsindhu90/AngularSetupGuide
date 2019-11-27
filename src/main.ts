import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import cssVars from 'css-vars-ponyfill';

// Added To Support CssVar  in IE
cssVars({
  // Options...
  watch: true,
  onWarning(message) {
    console.log(message); // 1
  }
});
if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
