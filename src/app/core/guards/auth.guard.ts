import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    // Mock authentication check
    const isAuthenticated = true;
    console.log('AuthGuard: Access granted to', state.url);
    return isAuthenticated;
};
