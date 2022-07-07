export interface IRegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}
