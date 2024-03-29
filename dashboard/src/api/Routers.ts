import { routerObject } from "../type";
export const Routers: routerObject[] = [
    {
        path: '/manage/user/login', //getToken
        handler: user.getToken,
        isAdmin: false,
        authType: 'none'
    },
    {
        path: '/manage/user/register',
        handler: user.register,
        isAdmin: false,
        authType: 'none'
    },
    {
        path: '/manage/user/resetpassword',
        handler: user.resetPassword,
        isAdmin: false,
        authType: 'token'
    }
]