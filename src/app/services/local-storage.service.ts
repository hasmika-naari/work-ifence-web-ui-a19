import { Injectable } from '@angular/core';

const APP_PREFIX = 'wifence-';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  static loadInitialState() {
    return Object.keys(localStorage).reduce((state: any, storageKey) => {
      if (storageKey.includes(APP_PREFIX)) {
        const stateKeys = storageKey
          .replace(APP_PREFIX, '')
          .toLowerCase()
          .split('.')
          .map((key) =>
            key
              .split('-')
              .map((token, index) =>
                index === 0
                  ? token
                  : token.charAt(0).toUpperCase() + token.slice(1)
              )
              .join('')
          );
        let currentStateRef = state;
        stateKeys.forEach((key, index) => {
          if (index === stateKeys.length - 1) {
            currentStateRef[key] = JSON.parse(
              localStorage.getItem(storageKey) || '{}'
            );
            return;
          }
          currentStateRef[key] = currentStateRef[key] || {};
          currentStateRef = currentStateRef[key];
        });
      }
      return state;
    }, {});
  }

  setItem(key: string, value: any) {
    localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
  }

  getItem(key: string) {
    const raw = localStorage.getItem(`${APP_PREFIX}${key}`);
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  getItemByName(key: string) {
    return localStorage.getItem(`${APP_PREFIX}${key}`);
  }

  removeItem(key: string) {
    localStorage.removeItem(`${APP_PREFIX}${key}`);
  }

  /** Clears all auth-related state including remember-me credentials. */
  clearAuthState(): void {
    ['authToken', 'authenticated', 'rememberMe', 'userName', 'passWord'].forEach(k => this.removeItem(k));
    try {
      sessionStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  }

  clean(): void {
    // window().sessionStorage.clear();
  }


  public saveUser(user: any): void {
    new Window().sessionStorage.removeItem(USER_KEY);
    new Window().sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = new Window().sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const tokenRaw = this.getItemByName('authToken');
    if (!tokenRaw) return false;

    const hasUsableToken = (() => {
      try {
        const token = JSON.parse(tokenRaw);

        if (typeof token === 'string') {
          return token.trim().length > 0;
        }

        // Some call sites may accidentally store objects; only treat known token shapes as valid.
        if (token && typeof token === 'object') {
          const maybeIdToken = (token as any).id_token;
          if (typeof maybeIdToken === 'string') {
            return maybeIdToken.trim().length > 0;
          }
          return false;
        }

        return false;
      } catch {
        return tokenRaw.trim().length > 0;
      }
    })();

    // Primary signal: explicit authenticated flag, but require a real token.
    const authenticatedRaw = this.getItemByName('authenticated');
    if (authenticatedRaw) {
      try {
        if (JSON.parse(authenticatedRaw) === true) {
          return hasUsableToken;
        }
      } catch {
        // ignore JSON parse issues
      }
    }

    // Fallback: token presence
    return hasUsableToken;
  }

  /** Tests that localStorage exists, can be written to, and read from. */
  testLocalStorage() {
    const testValue = 'testValue';
    const testKey = 'testKey';
    const errorMessage = 'localStorage did not return expected value';

    this.setItem(testKey, testValue);
    const retrievedValue = this.getItem(testKey);
    this.removeItem(testKey);

    if (retrievedValue !== testValue) {
      throw new Error(errorMessage);
    }
  }
}
