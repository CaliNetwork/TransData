import { WithId } from "mongodb";
import {requestObject, resultObject, returnObject, userObject} from "../misc/type"
import utils from "../misc/utils"

export const Gateway = async (contents: requestObject, isAdmin: boolean, app: (contents: requestObject, userObject: WithId<userObject>) => Promise<returnObject>): Promise<string> => {
    let result: resultObject = {
        succeed: true,
        msg: undefined,
        data: undefined
    }
    if (!contents.headers.authorization) throw new Error("Authorizarion header not found");
    const Authorization = contents.headers.authorization.split(' ')
    if ((Authorization)[0] !== 'Bearer') throw new Error("Authorizarion schemes mismatched");
    // Get User Object
    const userObject = await utils.getUserObject('token', Authorization[1]);
    if (!userObject) throw new Error('User Not Found or token refreshed');
    if (isAdmin && !userObject.isAdmin) throw new Error("Permission denied");
    const returnObject = await app(contents.body, userObject);
    result.msg = returnObject.msg
    result.data = returnObject.data

    return JSON.stringify(result)
}