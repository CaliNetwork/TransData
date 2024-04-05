import { routerObject } from "../misc/type";
import UserManage from "./apps/UserManage";
import { t } from "elysia";
import { userStats } from "./apps/UserStats";


export const Routers: routerObject[] = [
    {
        path: "/api/manage/user/get_token",
        handler: UserManage.getToken,
        isAdmin: false,
        authType: "none",
        schema: {
            body: t.Object({
                email: t.String(),
                password: t.String()
            })
        }
    },
    {
        path: "/api/manage/user/register",
        handler: UserManage.register,
        isAdmin: false,
        authType: "none",
        schema: {
            body: t.Object({
                email: t.String(),
                password: t.String(),
                address: t.Optional(t.String()),
                phone_code: t.Optional(t.Numeric()),
                phone_number: t.Optional(t.Numeric())
            })
        }
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
    {
        path: "/api/manage/ticket/modifyticket",
        handler: UserManage.modifyTicket,
        isAdmin: false,
        authType: "token",
        schema: {
            body: t.Object({
                contents: t.String(),
                isOpen: t.Boolean(),
                uuid: t.Optional(t.String()),
                instance_uuid: t.Optional(t.String())
            })
        }
    },
    {
        path: "/api/manage/order/placeorder",
        handler: UserManage.placeOrder,
        isAdmin: false,
        authType: "token",
        schema: {
            body: t.Object({
                template_uuid: t.String()
            })
        }
    },
    {
        path: "/api/manage/order/cancelorder",
        handler: UserManage.cancelOrder,
        isAdmin: false,
        authType: "token",
        schema: {
            body: t.Object({
                uuid: t.String()
            })
        }
    },
    {
        path: "/api/manage/instance/vm",
        handler: UserManage.vmInstanceManage,
        isAdmin: false,
        authType: 'token',
        schema: {
            body: t.Object({
                action: t.String(),
                name: t.Optional(t.String())
            })
        }
    },
    {
        path: "/api/manage/instance/portforwarding",
        handler: UserManage.vmInstanceManage,
        isAdmin: false,
        authType: 'token',
        schema: {
            body: t.Object({
                to: t.Optional(t.Object({
                    ip: t.String(),
                    port: t.Numeric()
                })),
                name: t.Optional(t.String())
            })
        }
    },
    {
        path: "/api/stats/:cata/:quantity",
        handler: userStats,
        isAdmin: false,
        authType: 'token',
        schema: {
            params: t.Object({
                cata: t.String(),
                quantity: t.Optional(t.String())
            })
        }
    }
]