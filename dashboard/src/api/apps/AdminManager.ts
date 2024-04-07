import { WithId } from "mongodb"
import { orderObject, returnObject, userObject, orderConfigure } from "../../misc/type"
import utils from "../../misc/utils";
import { randomUUID } from "crypto";

class AdminManager {
    async modifyUserObject(fullRequestObject: any, _userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        if (requestObject.uuid) {
            const oldUserObject = await utils.getObject('user', 'uuid', requestObject.uuid) as WithId<userObject> | null;
            if (oldUserObject) {
                await utils.updateObject('user', oldUserObject._id, requestObject.object);
            } else {
                throw new Error("User not found by searching for uuid");
            };
        } else {
            const oldUserObject = await utils.getObject('user', 'email', requestObject.object.email)
            if (oldUserObject) {
                const newUserObject = {
                    ...requestObject.object,
                    uuid: randomUUID(),
                    password: await Bun.password.hash(requestObject.object.password),
                    register_on: Math.floor(new Date().getTime() / 1000)
                }
                await utils.writeObject('user', newUserObject);
            } else {
                throw new Error("Email has been registered")
            }

        }
        return returnObject
    }
    async modifyOrderObject(fullRequestObject: any, _userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        if (requestObject.uuid) {
            const oldOrderObject = await utils.getObject('order', 'uuid', requestObject.uuid) as WithId<orderObject> | null;
            if (oldOrderObject) {
                await utils.updateObject('order', oldOrderObject._id, requestObject.object)
            } else {
                throw new Error("Order not found");
            }
        } else {
            const drop_wait = await utils.getObject('setting', 'cata', 'order') as WithId<orderConfigure>
            const newOrderObject = {
                ...requestObject.object,
                uuid: randomUUID(),
                droptime: Math.floor(new Date().getTime() / 1000) + drop_wait.drop_wait
            }
            await utils.writeObject('order', newOrderObject);
        }
        return returnObject
    }
}

export default new AdminManager