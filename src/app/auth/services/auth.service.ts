import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncryptionService } from '../../helpers/models/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private encryptionService: EncryptionService   // ✅ inject here
  ) { }

  login(data: any): Observable<any[]> {
    return this.http
      .post<any[]>(`${environment.apiUrl}userTokenLess/loginUser`, data)
      .pipe(
        map((userData: any) => {
          if (userData.status == '200') {

            // ✅ Encrypt the token before storing
            const encryptedToken = this.encryptionService.encrypt(userData.token);
            localStorage.setItem('authToken', encryptedToken);

            // (the rest of your localStorage items can remain plain or also be encrypted)
            localStorage.setItem('org_id', userData.userDetails.org_id);
            localStorage.setItem('user_id', userData.userDetails.user_id);
            localStorage.setItem('org_name', userData.userDetails.org_name);
            localStorage.setItem('user_role_id', userData.userDetails.user_role_id);
            localStorage.setItem('role_name', userData.userDetails.role_name);
            localStorage.setItem('userDetails', JSON.stringify(userData.userDetails));
            localStorage.setItem('org_type', userData.userDetails.org_type);

            return userData;
          } else {
            return '';
          }
        })
      );
  }
}
