import { forEach, keys } from "es-toolkit/compat";

export type CookieValues = {
   [k: string]: string;
};

export class MockReadonlyRequestCookies {
   private cookieMap = new Map<string, { name: string; value: string }>();

   constructor(cookies: CookieValues) {
      const cookieKeys = keys(cookies);
      forEach(cookieKeys, (ck) => {
         const cookie = { name: ck, value: cookies[ck] };
         this.cookieMap.set(ck, cookie);
      });
   }

   get(nameOrCookie: string | { name: string }) {
      const name = this.getCookieName(nameOrCookie);
      const cookie = this.cookieMap.get(name);
      return cookie ? { name: cookie.name, value: cookie.value } : undefined;
   }

   has(nameOrCookie: string | { name: string }) {
      const name = this.getCookieName(nameOrCookie);
      return this.cookieMap.has(name);
   }

   get size() {
      return this.cookieMap.size;
   }

   getAll(...args: Array<string | { name: string }> | []) {
      if (args.length === 0) {
         return Array.from(this.cookieMap.values());
      }
      const names = new Set(
         args.map((arg) => (typeof arg === "string" ? arg : arg.name))
      );
      return Array.from(this.cookieMap.values()).filter((cookie) =>
         names.has(cookie.name)
      );
   }

   private getCookieName(nameOrCookie: string | { name: string }) {
      return typeof nameOrCookie === "string"
         ? nameOrCookie
         : nameOrCookie.name;
   }
}
