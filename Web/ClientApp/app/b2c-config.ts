import { NgModule, InjectionToken } from '@angular/core';

export let B2C_CONFIG = new InjectionToken<B2CConfig>('b2cconfig');

export class B2CConfig {
	authority: string;
	client_id: string;
	redirect_uri: string;
	post_logout_redirect_uri: string;
	response_type: string;
	scope: string;
	silent_redirect_uri: string;
	automaticSilentRenew: boolean;
	filterProtocolClaims: boolean;
	loadUserInfo: boolean;
	metadataUrl: string;
	resetPassUrl: string;
}

export const APP_B2C_CONFIG: B2CConfig = {
	authority: 'https://login.microsoftonline.com/angular4b2c.onmicrosoft.com/oauth2/v2.0/authorize',
	client_id: '11246517-8ca1-41e9-8054-55acd1dfa250',
	redirect_uri: 'http://localhost:51126',
	post_logout_redirect_uri: 'http://localhost:51126',
	response_type: 'id_token token',
	scope: 'openid https://angular4b2c.onmicrosoft.com/spaapp/read https://angular4b2c.onmicrosoft.com/spaapp/user_impersonation',
	silent_redirect_uri: 'http://localhost:51126',
	automaticSilentRenew: false,
	filterProtocolClaims: false,
	loadUserInfo: false,
	metadataUrl: 'https://login.microsoftonline.com/angular4b2c.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_dev',
	resetPassUrl: 'https://login.microsoftonline.com/angular4b2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_reset'
};

@NgModule({
	providers: [{
		provide: B2C_CONFIG,
		useValue: APP_B2C_CONFIG
	}]
})
export class B2CConfigModule { }