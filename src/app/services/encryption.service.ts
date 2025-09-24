// import { Injectable } from '@angular/core';
// import * as CryptoJS from 'crypto-js';

// @Injectable({
//   providedIn: 'root'
// })
// export class EncryptionService {

//   constructor() { }


//   private readonly SECRET = 'your-secret-key';

//   encrypt(value: string): string {
//     return CryptoJS.AES.encrypt(value, this.SECRET).toString();
//   }


//   decrypt(encrypted: string): string {
//     const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET);
//     return bytes.toString(CryptoJS.enc.Utf8);
//   }


//   saveToken(token: string): void {
//     const encrypted = this.encrypt(token);
//     sessionStorage.setItem('auth_token', encrypted);
//   }

//   saveItem(key: string, value: any): void {
//     let stringValue: string;

//     if (typeof value === 'string') {
//       stringValue = value;
//     } else {
//       stringValue = JSON.stringify(value); // ✅ convert object/number/array to string
//     }

//     const encrypted = this.encrypt(stringValue);
//     sessionStorage.setItem(key, encrypted);
//   }


//   getItem<T = any>(key: string): T | null {
//     const encrypted = sessionStorage.getItem(key);
//     if (encrypted) {
//       const decrypted = this.decrypt(encrypted);
//       try {
//         return JSON.parse(decrypted) as T; // ✅ parse JSON if possible
//       } catch {
//         return decrypted as unknown as T; // if not JSON, return string
//       }
//     }
//     return null;
//   }




//   getToken(): string | null {
//     const encrypted = sessionStorage.getItem('auth_token');
//     if (encrypted) {
//       return this.decrypt(encrypted);
//     }
//     return null;
//   }


//   clearToken(): void {
//     sessionStorage.removeItem('auth_token');
//   }

// }
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private readonly SECRET = 'your-secret-key';

  constructor() {}

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.SECRET).toString(); // default Base64
  }

  decrypt(encrypted: string): string {
    if (!encrypted) return '';

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET);
      return bytes.toString(CryptoJS.enc.Utf8); // decode UTF-8
    } catch (e) {
      console.error('Decryption failed:', e);
      return '';
    }
  }

  saveToken(token: string): void {
    if (!token) return;
    sessionStorage.setItem('auth_token', this.encrypt(token));
  }

  getToken(): string | null {
    const encrypted = sessionStorage.getItem('auth_token')?.trim();
    if (!encrypted) return null;

    const decrypted = this.decrypt(encrypted);
    return decrypted || null;
  }

  saveItem(key: string, value: any): void {
    if (!key) return;

    let stringValue: string;
    if (typeof value === 'string') stringValue = value;
    else stringValue = JSON.stringify(value);

    sessionStorage.setItem(key, this.encrypt(stringValue));
  }

  getItem<T = any>(key: string): T | null {
    if (!key) return null;

    const encrypted = sessionStorage.getItem(key)?.trim();
    if (!encrypted) return null;

    const decrypted = this.decrypt(encrypted);
    if (!decrypted) return null;

    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return decrypted as unknown as T;
    }
  }

  clearToken(): void {
    sessionStorage.removeItem('auth_token');
  }

  clearItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}
