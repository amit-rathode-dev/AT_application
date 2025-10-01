import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncryptionService } from '../../services/encryption.service'; // ✅ import the service

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
   // Encrypt only sensitive fields
  const payload = {
    user_name: this.encryptionService.encrypt(data.user_name),
    password: this.encryptionService.encrypt(data.password)
  };

    return this.http
      .post<any[]>(`${environment.apiUrl}api/userTokenLess/loginUser`,  payload )
      .pipe(
        map((userData: any) => {
    // return this.http
    //   .post<any[]>(`${environment.apiUrl}api/userTokenLess/loginUser`, data)
    //   .pipe(
    //     map((userData: any) => {
          if (userData.status == '200') {

            const detailsToStore = {
              org_id: userData.userDetails?.org_id,
              org_type: userData.userDetails?.org_type,
              role_name: userData.userDetails?.role_name,
              user_role_id: userData.userDetails?.user_role_id,
              org_name: userData.userDetails?.org_name,
              isactive: userData.userDetails?.isactive,
              user_id: userData.userDetails?.user_id
            };

            // ✅ Encrypt the token before storing
            //     const encryptedToken = this.encryptionService.encrypt(userData.token);
            // sessionStorage.setItem('authToken', userData.token);

            // // (the rest of your sessionStorage items can remain plain or also be encrypted)
            // sessionStorage.setItem('org_id', userData.userDetails.org_id);
            // sessionStorage.setItem('user_id', userData.userDetails.user_id);
            // sessionStorage.setItem('org_name', userData.userDetails.org_name);
            // sessionStorage.setItem('user_role_id', userData.userDetails.user_role_id);
            // sessionStorage.setItem('role_name', userData.userDetails.role_name);
            // // sessionStorage.setItem('userDetails', JSON.stringify(userData.userDetails));
            // sessionStorage.setItem('org_type', userData.userDetails.org_type);

            // sessionStorage.setItem('userDetails', JSON.stringify(detailsToStore));

            this.encryptionService.saveItem('authToken', userData.token);
            this.encryptionService.saveItem('org_id', userData.userDetails.org_id);
            this.encryptionService.saveItem('user_id', userData.userDetails.user_id);
            this.encryptionService.saveItem('org_name', userData.userDetails.org_name);
            this.encryptionService.saveItem('user_role_id', userData.userDetails.user_role_id);
            this.encryptionService.saveItem('role_name', userData.userDetails.role_name);
            this.encryptionService.saveItem('org_type', userData.userDetails.org_type);
            this.encryptionService.saveItem('userDetails',JSON.stringify(detailsToStore)); // ✅ object handled

            return userData;
          } else {
            return '';
          }
        })
      );
  }
  // login(data: any): Observable<any> {
  //   return this.http
  //     .post<any>(`${environment.apiUrl}userTokenLess/loginUser`, data, { withCredentials: true })
  //     .pipe(
  //       map((userData: any) => {
  //         if (userData.status === 200 || userData.status === '200') { // Handle both numeric and string status
  //           return userData;
  //         } else {
  //           throw new Error(userData.message || 'Login failed');
  //         }
  //       }),
  //       catchError(error => {
  //         console.error('Login error:', error);
  //         throw error; // Propagate error for component handling
  //       })
  //     );
  // }
  getToken(): string | null {
    return this.encryptionService.getItem('authToken');
  }

  getOrgType(): string | null {
    const orgType = this.encryptionService.getItem('org_type');
    return orgType ? orgType.toLowerCase() : null;
  }

  getRoleName(): string | null {
    const roleName = this.encryptionService.getItem('role_name');
    return roleName ? roleName.toLowerCase() : null;
  }

  // getUserDetails(): any | null {
  //   const userDetails = this.encryptionService.getItem('userDetails');
  //   return userDetails ? JSON.parse(userDetails) : null;
  // }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
