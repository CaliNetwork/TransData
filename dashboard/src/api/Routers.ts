import { routerObject } from "../misc/type";
import UserManage from "./apps/UserManage";
import { t } from "elysia";

const postWithPskAndEmail = {
    body: t.Object({
        email: t.String(),
        password: t.String()
    })
}

export const Routers: routerObject[] = [
    {
        path: "/api/manage/user/get_token",
        handler: UserManage.getToken,
        isAdmin: false,
        authType: "none",
        schema: postWithPskAndEmail
    },
    {
        path: "/api/manage/user/register",
        handler: UserManage.register,
        isAdmin: false,
        authType: "none",
        schema: postWithPskAndEmail
    },
    {
        path: "/api/manage/user/resetpassword",
        handler: UserManage.resetPassword,
        isAdmin: false,
        authType: "token",
        schema: {
            body: t.Object({
                password: t.String()
            })
        }
    },
]