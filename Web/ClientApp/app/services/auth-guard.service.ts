import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from './auth.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	constructor(private auth: Auth, private router: Router) { }

	checkLogin(): Observable<boolean> | boolean {
		let isLoggedIn = this.auth.isLoggedInObs();
		isLoggedIn.subscribe((loggedin) => {
			if (!loggedin) {
				this.router.navigate(['login']);
			}
		});
		return isLoggedIn;
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this.checkLogin();
	}

	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this.canActivate(childRoute, state);
	}
}