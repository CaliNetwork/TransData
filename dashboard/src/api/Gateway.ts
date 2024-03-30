import { dataObject, requestObject, resultObject, returnObejct } from "../misc/type"
import utils from "../misc/utils"

export const Gateway = async (content: requestObject, isAdmin: boolean, app: () => Promise<returnObejct>): Promise<string> => {
    let result:resultObject  = {
        succeed: true,
        msg: undefined,
        data: undefined
    }
    if (!content.headers.Authorization) throw new Error("Authorizarion header not found");
    const Authorization = content.headers.Authorization.split(' ')
    if ((Authorization)[0] !== 'Bearer') throw new Error("Authorizarion schemes mismatched");
    // Get User Object
    const userObject = await utils.getUserObject('token', Authorization[1]);    
    if (!userObject) throw new Error('User Not Found');
    if (isAdmin && !userObject.isAdmin) throw new Error("Permission denied");

    const returnObject = await app();

    result = { ...result, ...returnObject };

    return JSON.stringify(result)
}