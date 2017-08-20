import { Component } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
	selector: 'login',
	styleUrls: ['./login.css'],
	templateUrl: './login-component.html'
})
export class LoginComponent {

	constructor(private service: Auth) { }

	login() {
		this.service.startSigninMainWindow();
	}
}