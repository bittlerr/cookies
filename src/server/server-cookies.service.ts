import { Inject, Injectable } from '@angular/core';

import { CookieOptions } from '../cookie-options';
import { CookiesOptionsService } from '../cookies-options.service';
import { CookiesService } from '../cookies.service';
import { isString, mergeOptions, safeDecodeURIComponent } from '../utils';
import { REQUEST, RESPONSE } from '../tokens';

@Injectable()
export class ServerCookiesService extends CookiesService {
  private newCookies: { [name: string]: string | undefined } = {};

  constructor(
    cookiesOptions: CookiesOptionsService,
    @Inject(REQUEST) private request: any,
    @Inject(RESPONSE) private response: any,
  ) {
    super(cookiesOptions);
  }

  protected cookiesReader(): Record<string, string> {
    const allCookies: Record<string, string> = {
      ...this.request.cookies,
      ...this.newCookies,
    };
    const cookies: Record<string, string> = {};

    for (const name in allCookies) {
      if (typeof allCookies[name] !== 'undefined') {
        cookies[name] = safeDecodeURIComponent(allCookies[name]);
      }
    }

    return cookies;
  }

  protected cookiesWriter(): (
    name: string,
    value: string | undefined,
    options?: CookieOptions,
  ) => void {
    return (
      name: string,
      value: string | undefined,
      options?: CookieOptions
    ) => {
      this.newCookies[name] = value;
      this.response.cookie(name, value, this.buildCookieOptions(options));
    };
  }

  private buildCookieOptions(options?: CookieOptions): CookieOptions {
    const opts: CookieOptions = mergeOptions(this.options, options);

    if (isString(opts.expires)) {
      opts.expires = new Date(opts.expires);
    }

    return opts;
  }
}
