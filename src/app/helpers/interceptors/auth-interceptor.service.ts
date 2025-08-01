import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// export class AuthInterceptorService implements HttpInterceptor {
  export class AuthInterceptorService {

    intercept: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
      const token = localStorage.getItem('authToken'); 
  
      const username = 'Admin';
      const password = 'Admin';

      const basicAuthToken = btoa(`${username}:${password}`);
      // const token = localStorage.getItem('authToken')
      
      if (token) {
        const clonedReq = req.clone({
          
          setHeaders: {
           'auth-token': token ? token : ''
          }
        });
        return next(clonedReq); 
      }
  
      return next(req);  
    }
}

