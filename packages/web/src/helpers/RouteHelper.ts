import { AppRoutes } from "../types";
import { ClientIdType } from "../types/contracts/ConfigContract";

export class RouteHelper {
  static getRootRoute(): AppRoutes {
    return AppRoutes.UserRoot;
  }

  static isRootRoute(path: string) {
    const root = RouteHelper.getRootRoute();
    return path === root;
  }
}
