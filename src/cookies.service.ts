import { Injectable } from '@angular/core';

import { CookieOptions } from './cookie-options';
import { CookiesOptionsService } from './cookies-options.service';
import { safeJsonParse } from './utils';

@Injectable()
export class CookiesService {
  protected options: CookieOptions;

  constructor(cookieOptions: CookiesOptionsService) {
    this.options = cookieOptions.options;
  }

  put(key: string, value: string, options?: CookieOptions): void {
    this.cookiesWriter()(key, value, options);
  }

  putObject(key: string, value: Object, options?: CookieOptions): void {
    this.put(key, JSON.stringify(value), options);
  }

  get(key: string): string {
    return (<any>this.cookiesReader())[key];
  }

  getObject(key: string): Record<string, string> | string {
    const value = this.get(key);

    return value ? safeJsonParse(value) : value;
  }

  getAll(): Record<string, string> {
    return <any>this.cookiesReader();
  }

  remove(key: string, options?: CookieOptions): void {
    this.cookiesWriter()(key, undefined, options);
  }

  removeAll(): void {
    const cookies = this.getAll();

    Object.keys(cookies).forEach(key => this.remove(key));
  }

  protected cookiesReader(): Record<string, string> {
    return {};
  }

  protected cookiesWriter(): (name: string, value: string | undefined, options?: CookieOptions) => void {
    return () => { };
  }
}
