import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error) => {
            console.error('An error occurred:', error);
            // Here you might trigger a notification service or redirect
            return throwError(() => error);
        })
    );
};
