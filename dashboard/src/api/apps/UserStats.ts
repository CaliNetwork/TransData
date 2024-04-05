import { WithId } from "mongodb";
import {returnObject, userObject } from "../../misc/type";

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

    return returnObject
}