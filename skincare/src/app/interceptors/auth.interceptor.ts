import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned).pipe(
      catchError(error => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
  return next(req).pipe(
    catchError(error => {
        console.log('HTTP error:', error);
      if (error.status === 401) {
       //router.navigate(['/login']);
      }
      return throwError(error);
    })
  );
};