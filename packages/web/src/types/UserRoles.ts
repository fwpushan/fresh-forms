import { ClientIdType } from "./contracts/ConfigContract";

export enum UserRoles {
  user = "forms-viewer",
}

export const ClientRolesMap: { [Value in ClientIdType]: UserRoles[] } = {
  [ClientIdType.User]: [UserRoles.user],
};
