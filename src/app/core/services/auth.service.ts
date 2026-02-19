import { Injectable, inject, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User, user, signOut } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    user = signal<User | null>(null);

    // Observable of user auth state
    user$ = user(this.auth);
    private sub: Subscription;

    constructor() {
        this.sub = this.user$.subscribe(u => this.user.set(u));
    }

    login() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    logout() {
        return signOut(this.auth);
    }
}
