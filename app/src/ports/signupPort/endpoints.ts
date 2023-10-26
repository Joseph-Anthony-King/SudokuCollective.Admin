export class Endpoints {
	static signupEndpoint = `${process.env.VUE_APP_API_URL}api/v1/signup`;
	static resendEmailConfirmationEndpoint = `${process.env.VUE_APP_API_URL}api/v1/signup/resendemailconfirmation`;
}
