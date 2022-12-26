export class Endpoints {
	static loginEndpoint = `${process.env.VUE_APP_API_URL}api/v1/login`;
	static confirmUserNameEndpoint = `${process.env.VUE_APP_API_URL}api/v1/login/confirmusername`;
}
