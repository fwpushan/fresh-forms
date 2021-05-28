export interface GetConfig {
  auth: AuthConfig;
}

export enum ClientIdType {
  User = "user",
}

export interface AuthConfig {
  url: string;
  realm: string;
  clientIds: { [Value in ClientIdType]: string };
  externalSiteMinderLogoutUrl?: string;
}

export interface AppConfig {
  authConfig: AuthConfig;
  updateTime: Date;
}
