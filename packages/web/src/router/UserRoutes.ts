import { RouteRecordRaw } from "vue-router";
import UserDashboard from "../views/user/UserDashboard.vue";
import AppUser from "../views/user/AppUser.vue";
import {
  UserRoutesConst,
  SharedRouteConst,
} from "../constants/routes/RouteConstants";
import Login from "../views/user/Login.vue";
import { AppConfigService } from "../services/AppConfigService";
import { ClientIdType } from "../types/contracts/ConfigContract";
import { AuthStatus, AppRoutes } from "../types";
import User from "../views/user/User.vue";
import HomeSideBar from "../components/layouts/User/sidebar/HomeSideBar.vue";
import FormList from "../components/generic/FormList.vue";
import FormContainer from "../components/generic/FormContainer.vue";

export const UserRoutes: Array<RouteRecordRaw> = [
  {
    path: AppRoutes.UserRoot,
    name: UserRoutesConst.APP_USER,
    component: AppUser,
    children: [
      {
        path: AppRoutes.Login,
        name: UserRoutesConst.LOGIN,
        component: Login,
      },
      {
        path: "",
        redirect: `${AppRoutes.UserRoot}/${AppRoutes.forms}`,
        name: UserRoutesConst.FORM_LIST,
        component: User,
        children: [
          {
            path: AppRoutes.FormSubmissions,
            name: UserRoutesConst.FORM_SUBMISSION,
            components: {
              default: UserDashboard,
              sidebar: HomeSideBar,
            },
          },
          {
            path: AppRoutes.forms,
            name: UserRoutesConst.FORM_LIST,
            components: {
              default: FormList,
              sidebar: HomeSideBar,
            },
            children: [],
          },
          {
            path: AppRoutes.formContainer,
            name: UserRoutesConst.FORM_CONTAINER,
            components: {
              default: FormContainer,
              sidebar: HomeSideBar,
            },
          },
        ],
      },
    ],
    beforeEnter: (to, from, next) => {
      AppConfigService.shared
        .initAuthService(ClientIdType.User)
        .then(() => {
          const status = AppConfigService.shared.authStatus({
            type: ClientIdType.User,
            path: to.path,
          });
          switch (status) {
            case AuthStatus.Continue:
              AppConfigService.shared.checkUser().then(result => {
                if (result) {
                  next();
                }
              });
              break;
            case AuthStatus.RequiredLogin:
              next({
                name: UserRoutesConst.LOGIN,
              });
              break;
            case AuthStatus.RedirectHome:
              AppConfigService.shared.checkUser().then(result => {
                if (result) {
                  next({
                    name: UserRoutesConst.FORM_LIST,
                  });
                }
              });

              break;
            case AuthStatus.ForbiddenUser:
              next({
                name: SharedRouteConst.FORBIDDEN_USER,
              });
              break;
            default: {
              next({
                name: SharedRouteConst.FORBIDDEN_USER,
              });
            }
          }
        })
        .catch(e => {
          console.error(e);
          throw e;
        });
    },
  },
];
