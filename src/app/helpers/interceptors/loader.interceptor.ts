// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';

// import { finalize } from 'rxjs/operators';

// import { LoaderService } from '../../services/loader.service';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   const loader = inject(LoaderService);

//   loader.show();

//   return next(req).pipe(
//     finalize(() => loader.hide())
//   );
// };



import { HttpInterceptorFn } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);


  const excludeUrls: string[] = [
    // `${environment.apiUrl}/api/categories/getProducts`,
    `${environment.apiUrl}/api/categories/getProducts`,

  ];


  const shouldSkip = excludeUrls.some(url => req.url.includes(url));

  if (!shouldSkip) {
    loader.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkip) {
        loader.hide();
      }
    })
  );
};
