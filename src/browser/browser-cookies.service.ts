import { Injectable } from '@angular/core';

import { CookiesService } from '../cookies.service';
import { CookieOptions } from '../cookie-options';
import { CookiesOptionsService } from '../cookies-options.service';
import { isBlank, isString, mergeOptions, safeDecodeURIComponent } from '../utils';

@Injectable()
export class BrowserCookiesService extends CookiesService {
  constructor(cookiesOptions: CookiesOptionsService) {
    super(cookiesOptions);
  }

  get cookieString(): string {
    return document.cookie || '';
  }

  set cookieString(val: string) {
    document.cookie = val;
  }

  protected cookiesReader(): { [key: string]: any } {
    let lastCookies: Record<string, string> = {};
    let lastCookieString = '';
    let currentCookieString = this.cookieString;

    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      const cookiesArray = lastCookieString.split('; ');
      lastCookies = {};

      for (let i = 0; i < cookiesArray.length; i++) {
        const cookie = cookiesArray[i];
        const index = cookie.indexOf('=');

        if (index > 0) {
          // ignore nameless cookies
          const name = safeDecodeURIComponent(cookie.substring(0, index));

          if (isBlank((lastCookies)[name])) {
            lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      }
    }

    return lastCookies;
  }

  protected cookiesWriter(): (name: string, value: string | undefined, options?: CookieOptions) => void {
    return (name: string, value: string | undefined, options?: CookieOptions) => {
      this.cookieString = this.buildCookieString(name, value, options);
    };
  }

  private buildCookieString(name: string, value: string | undefined, options?: CookieOptions): string {
    const opts: CookieOptions = mergeOptions(this.options, options);
    let expires = opts.expires;

    if (isBlank(value)) {
      expires = new Date(0);
      value = '';
    }

    if (isString(expires)) {
      expires = new Date(expires);
    }

    if (opts.sameSite === 'none' && !opts.secure) {
      console.error(
        [
          `Cookie "${name}" rejected`,
          `because it has the “SameSite=None” attribute but is missing the “secure” attribute.`
        ]
          .join(' ')
      );
    }

    let str = encodeURIComponent(name) + '=' + encodeURIComponent((value as string));

    str += expires ? `;Expires=${expires.toUTCString()}` : '';
    str += opts.maxAge ? `;Max-Age=${opts.maxAge}` : '';
    str += opts.domain ? `;Domain=${opts.domain}` : '';
    str += opts.path ? `;Path=${opts.path}` : '';
    str += opts.secure ? ';Secure' : '';
    str += opts.httpOnly ? ';HttpOnly' : '';
    str += opts.sameSite ? `;SameSite=${opts.sameSite}` : '';

    const cookiesLength = str.length + 1;

    if (cookiesLength > 4096) {
      console.log(
        [
          `Cookie \'${name}\' possibly not set`,
          `or overflowed because it was too large (${cookiesLength} > 4096 bytes)!`
        ]
          .join(' ')
      );
    }

    return str;
  }
}
