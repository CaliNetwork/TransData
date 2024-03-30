import { routerObject } from "../misc/type";
import UserManage from "./apps/UserManage";
import { t } from "elysia";

export const Routers: routerObject[] = [
    {
        path: "/api/manage/user/get_token",
        handler: UserManage.getToken,
        isAdmin: false,
        authType: "none"
    },
    {
        path: "/api/manage/user/register",
        handler: UserManage.register,
        isAdmin: false,
        authType: "none",
        schema: {
            body: t.Object({
                //Will try to figure out how to generate schemas from types
            })
        }
    },
]