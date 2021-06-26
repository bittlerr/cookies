import { CookieOptions } from './cookie-options';

export function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

export function mergeOptions(oldOptions: CookieOptions, newOptions?: CookieOptions): CookieOptions {
  if (!newOptions) {
    return oldOptions;
  }

  const options = {
    path: isPresent(newOptions.path) ? newOptions.path : oldOptions.path,
    domain: isPresent(newOptions.domain) ? newOptions.domain : oldOptions.domain,
    expires: isPresent(newOptions.expires) ? newOptions.expires : oldOptions.expires,
    secure: isPresent(newOptions.secure) ? newOptions.secure : oldOptions.secure,
    httpOnly: isPresent(newOptions.httpOnly) ? newOptions.httpOnly : oldOptions.httpOnly,
    maxAge: isPresent(newOptions.maxAge) ? newOptions.maxAge : oldOptions.maxAge,
    signed: isPresent(newOptions.signed) ? newOptions.signed : oldOptions.signed,
    encode: isPresent(newOptions.encode) ? newOptions.encode : oldOptions.encode,
    sameSite: isPresent(newOptions.sameSite) ? newOptions.sameSite : oldOptions.sameSite,
  };

  Object
    .keys(options)
    .forEach((key: keyof CookieOptions) => options[key] === undefined && delete options[key]);

  return options;
}

export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}

export function safeJsonParse(str: string): { [key: string]: any } | string {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
