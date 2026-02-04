import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    console.log(`[HTTP Request] ${req.method} ${req.url}`);
    return next(req).pipe(
        tap({
            next: (event) => console.log(`[HTTP Response] ${req.url}`, event),
            error: (error) => console.error(`[HTTP Error] ${req.url}`, error)
        })
    );
};
