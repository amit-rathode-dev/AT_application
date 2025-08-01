import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private router: Router)
   { 
    console.log(environment.apiUrl,'))))))))');
   }



   login(data:any): Observable<any[]> {

    console.log('here checking data.....',data);
    
    

    return this.http
      .post<any[]>(`${environment.apiUrl}userTokenLess/loginUser`, data)
      // .post<any[]>(`https://172.16.16.79:5000/userTokenLess/loginUser`, data)
      .pipe(
        map((userData: any) => {
          console.log(userData,'<-----Here is the user data');
          
          if (userData.status=='200') {
            localStorage.setItem('authToken', userData.token);
            localStorage.setItem('org_id',userData.userDetails.org_id)
            localStorage.setItem('user_id',userData.userDetails.user_id)
            localStorage.setItem('org_name',userData.userDetails.org_name)
            localStorage.setItem('user_role_id',userData.userDetails.user_role_id)

            localStorage.setItem('org_id',userData.userDetails.org_id)
              localStorage.setItem('role_name',userData.userDetails.role_name)
            localStorage.setItem('userDetails', JSON.stringify(userData.userDetails));





            localStorage.setItem('org_type',userData.userDetails.org_type)
          
            return userData;
          } else {
            return '';
          }
        })
      );
  }







}
