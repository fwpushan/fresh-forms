/**
 * User information extraced from the token during the
 * authentication process on JwtStrategy validate method.
 */
export interface IUserToken {
  userName: string;
  email: string;
  scope: string;
  familyName: string;
  birthdate: string;
  email_verified: string;
  given_name: string;
  roles: string[];
  sub: string;
  resource_access: any;
  preferred_username: string;
  name: string;
}
