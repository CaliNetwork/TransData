import { WithId } from "mongodb";
import {returnObject, userObject } from "../../misc/type";
import utils from "../../misc/utils";

const vaildActions: string[] = [
    'user',
    'order',
    'billing',
    'ticket',
    'instance'
]

export const userStats = async (fullRequestObject: any, userObject: WithId<userObject>): Promise<returnObject> => {
    let returnObject: returnObject = {};
    const requestObject = fullRequestObject.params;
    if (!vaildActions.includes(requestObject.params.cata)) throw new Error("Invaild action");
    if (requestObject.params.cata === 'user') {
        returnObject.data = userObject;
        delete returnObject.data._id;
    } else {
        returnObject.data = await utils.getObject(requestObject.cata, 'user_uuid', userObject.uuid, requestObject.quantity, true);
        for (const object of returnObject.data) {
            delete object._id
        }
    }
    return returnObject
}