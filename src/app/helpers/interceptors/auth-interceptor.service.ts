// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// // export class AuthInterceptorService implements HttpInterceptor {
//   export class AuthInterceptorService {

//     intercept: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//       const token = sessionStorage.getItem('authToken'); 

//       const username = 'Admin';
//       const password = 'Admin';

//       const basicAuthToken = btoa(`${username}:${password}`);
//       // const token = sessionStorage.getItem('authToken')

//       if (token) {
//         const clonedReq = req.clone({

//           setHeaders: {
//            'auth-token': token ? token : ''
//           }
//         });
//         return next(clonedReq); 
//       }

//       return next(req);  
//     }
// }




import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { EncryptionService } from '../../services/encryption.service';
import { ModealHandlerService } from '../../components/shared/services/modeal-handler.service';

@Injectable({
  providedIn: 'root'
})
// export class AuthInterceptorService {

//   intercept: HttpInterceptorFn = (
//     req: HttpRequest<any>, 
//     next: HttpHandlerFn
//   ): Observable<HttpEvent<any>> => {

//     const encrypdecryppService = inject(EncryptionService)


//     const token = sessionStorage.getItem('authToken');
//       const modalHandler = inject(ModealHandlerService);

//     const decryptedToken = token ? encrypdecryppService.getItem('authToken') :null




//     console.log(token,'token in interceptor');




//       const clonedReq = decryptedToken
//       ? req.clone({
//           setHeaders: {
//             'auth-token': decryptedToken || ''
//           }
//         })
//       : req;


//     return next(clonedReq).pipe(
//       catchError((err: HttpErrorResponse) => {
//         let msg = err.error?.message || 'Something went wrong!';

//         if (err.status === 429) msg += ' Please try again after 5 minutes.';
//         else if (err.status === 401) msg = 'Unauthorized. Please login again.';

//         modalHandler.showError(msg);

//         return throwError(() => err);
//       })
//     );

//   }
// }


export class AuthInterceptorService {
  intercept: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> => {

    const encrypdecryppService = inject(EncryptionService);
    const token = sessionStorage.getItem('authToken');
    const modalHandler = inject(ModealHandlerService);

    const decryptedToken = token ? encrypdecryppService.getItem('authToken') : null;

    const clonedReq = decryptedToken
      ? req.clone({
        setHeaders: {
          'auth-token': decryptedToken || ''
        }
      })
      : req;


    return next(clonedReq).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = err.error?.message || 'Something went wrong!';
        modalHandler.showError(msg);

        return throwError(() => new Error(msg));
      })
    );

  }
}

