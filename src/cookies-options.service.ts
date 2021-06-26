import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

import { CookieOptions } from './cookie-options';
import { mergeOptions } from './utils';

export const COOKIES_OPTIONS = new InjectionToken('COOKIES_OPTIONS');

@Injectable()
export class CookiesOptionsService {
  private defaultOptions: CookieOptions;
  private _options: CookieOptions;

  constructor(
    @Inject(COOKIES_OPTIONS) options: CookieOptions = {},
    private injector: Injector,
  ) {
    this.defaultOptions = {
      path: this.injector.get(APP_BASE_HREF, '/'),
      domain: undefined,
      expires: undefined,
      secure: false
    };
    this._options = mergeOptions(this.defaultOptions, options);
  }

  get options(): CookieOptions {
    return this._options;
  }
}
