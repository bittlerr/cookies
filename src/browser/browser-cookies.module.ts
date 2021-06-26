import { ModuleWithProviders, NgModule } from '@angular/core';

import { CookieOptions } from '../cookie-options';
import { COOKIES_OPTIONS, CookiesOptionsService } from '../cookies-options.service';
import { CookiesService } from '../cookies.service';
import { BrowserCookiesService } from './browser-cookies.service';

@NgModule()
export class BrowserCookiesModule {
  static forRoot(options: CookieOptions = {}): ModuleWithProviders<BrowserCookiesModule> {
    return {
      ngModule: BrowserCookiesModule,
      providers: [
        { provide: COOKIES_OPTIONS, useValue: options },
        CookiesOptionsService,
        { provide: CookiesService, useClass: BrowserCookiesService }
      ]
    };
  }
}
