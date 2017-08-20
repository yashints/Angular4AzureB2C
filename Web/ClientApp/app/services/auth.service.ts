import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserManager, User } from 'oidc-client';
import { B2C_CONFIG, B2CConfig } from '../b2c-config';

@Injectable()
export class Auth {
	mgr: UserManager;
	userLoadededEvent: EventEmitter<User> = new EventEmitter<User>();
	currentUser: User;
	loggedIn = false;

	authHeaders: Headers;

	constructor( @Inject(B2C_CONFIG) private config: B2CConfig,
		private http: Http,
	private router: Router) {
		this.mgr = new UserManager(this.config);

		this.mgr.getUser()
			.then( user => {
				if (user) {
					this.loggedIn = true;
					this.currentUser = user;
					this.userLoadededEvent.emit(user);
				}
				else {
					this.loggedIn = false;
				}
			})
			.catch((err) => {
				this.loggedIn = false;
			});

		this.mgr.events.addUserLoaded((user) => {
			this.currentUser = user;
			this.loggedIn = !(user === undefined);
		});

		this.mgr.events.addUserUnloaded((e) => {
			this.loggedIn = false;
		});
	}

	isLoggedInObs(): Observable<boolean> {
		return Observable.fromPromise(this.mgr.getUser()).map<User, boolean>((user) => {
			if (user) {
				return true;
			} else {
				return false;
			}
		});
	}

	getUser() {
		this.mgr.getUser().then((user) => {
			this.currentUser = user;
			console.log('got user', user);
			this.userLoadededEvent.emit(user);
		}).catch( (err) => {
			console.log(err);
		});
	}

	removeUser() {
		this.mgr.removeUser().then(() => {
			this.userLoadededEvent.emit(undefined);
			console.log('user removed');
		}).catch((err) => {
			console.log(err);
		});
	}

	startSigninMainWindow() {
		this.mgr.signinRedirect({ data: 'some data' }).then(() => {
			console.log('signinRedirect done');
		}).catch( (err) => {
			console.log(err);
		});
	}

	endSigninMainWindow() {
		this.mgr.signinRedirectCallback().then( (user) => {
			console.log('signed in', user);
		}).catch( (err) => {
			console.log(err);
		});
	}

	startSignoutMainWindow() {
		this.mgr.getUser().then(user => {
			return this.mgr.signoutRedirect({ id_token_hint: user.id_token }).then(resp => {
				console.log('signed out', resp);
				setTimeout(5000, () => {
					console.log('testing to see if fired...');
				});
			}).catch((err) => {
				console.log(err);
			});
		});
	}

	endSignoutMainWindow() {
		this.mgr.signoutRedirectCallback().then((resp) => {
			console.log('signed out', resp);
		}).catch( (err) => {
			console.log(err);
		});
	}

	redirectCallback() {
		this.mgr.signinRedirectCallback()
			.then(user => {
				this.currentUser = user;
				this.router.navigateByUrl('/');
			})
			.catch(err => {
				if (err && err.error_description && err.error_description.indexOf('AADB2C90118') > -1) {
					let url = `${this.config.resetPassUrl}&client_id=${this.config.client_id}&redirect_uri=${this.config.redirect_uri}&response_type=${this.config.response_type}&scope=${this.config.scope}&nonce=${this.randomString(32)}`;
					window.location.href = url;
				}
				else {
					this.router.navigateByUrl('/login');
				}
				console.log(err);
			});
	}

	private randomString(length: number) {
		let text = '';
		let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	AuthGet(url: string, options?: RequestOptions): Observable<Response> {

		if (options) {
			options = this._setRequestOptions(options);
		}
		else {
			options = this._setRequestOptions();
		}
		return this.http.get(url, options);
	}
	/**
	 * @param options if options are not supplied the default content type is application/json
	 */
	AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

		let body = JSON.stringify(data);

		if (options) {
			options = this._setRequestOptions(options);
		}
		else {
			options = this._setRequestOptions();
		}
		return this.http.put(url, body, options);
	}
	/**
	 * @param options if options are not supplied the default content type is application/json
	 */
	AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

		if (options) {
			options = this._setRequestOptions(options);
		}
		else {
			options = this._setRequestOptions();
		}
		return this.http.delete(url, options);
	}
	/**
	 * @param options if options are not supplied the default content type is application/json
	 */
	AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

		let body = JSON.stringify(data);

		if (options) {
			options = this._setRequestOptions(options);
		} else {
			options = this._setRequestOptions();
		}
		return this.http.post(url, body, options);
	}


	private _setAuthHeaders(user: any): void {
		this.authHeaders = new Headers();
		this.authHeaders.append('Authorization', user.token_type + ' ' + user.access_token);
		if (this.authHeaders.get('Content-Type')) {

		} else {
			this.authHeaders.append('Content-Type', 'application/json');
		}
	}
	private _setRequestOptions(options?: RequestOptions) {
		if (this.loggedIn) {
			this._setAuthHeaders(this.currentUser);
		}
		if (options) {
			if (!options.headers) {
				options.headers = new Headers();
			}
			options.headers.append(this.authHeaders.keys()[0], this.authHeaders.values()[0][0]);
		} else {
			options = new RequestOptions({ headers: this.authHeaders });
		}

		return options;
	}
}