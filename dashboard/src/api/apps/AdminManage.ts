import { WithId } from "mongodb"
import { orderObject, returnObject, userObject, orderConfigure, billingConfigure, ticketObject } from "../../misc/type"
import utils from "../../misc/utils";
import { randomUUID } from "crypto";

const billingActions: string[] = ['setmethod', 'refund']

class AdminManage {
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
    async billingManage(fullRequestObject: any, _userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        if (!billingActions.includes(requestObject.action)) throw new Error("Invaild action");

        switch (requestObject.action) {
            case 'setmethod':
                if (requestObject.object.conf) {
                    const billingConfigure = await utils.getObject('setting', 'cata', 'billing') as WithId<billingConfigure>;
                    await utils.updateObject('setting', billingConfigure._id, requestObject.object.conf)
                } else {
                    throw new Error("Invaild data object");
                }
                break;
            case 'refund':
                // apply refund logic here
                break;
            default:
                throw new Error("Invaild action");
        }
        return returnObject
    }
    async modifyTicket(fullRequestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        if (requestObject.uuid) {
            const ticketObject = await utils.getObject('ticket', 'uuid', requestObject.uuid) as WithId<ticketObject> | null
            if (ticketObject) {
                let updateTicketObject = {
                    instance_uuid: requestObject.instance_uuid,
                    contents: ticketObject.contents + '\n' + requestObject.contents,
                    isOpen: requestObject.isOpen
                }
                await utils.updateObject('ticket', ticketObject._id, updateTicketObject)
            } else {
                throw new Error("Ticket not found");
            }
        } else {
            let newTicketObject = {
                uuid: randomUUID(),
                user_uuid: userObject.uuid,
                instance_uuid: requestObject.instance_uuid,
                contents: requestObject.contents,
                isOpen: true
            }
            returnObject.data = newTicketObject.uuid;
            utils.writeObject('ticket', newTicketObject);
        }
        return returnObject
    }
    async manageCluster(fullRequestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        return returnObject
    }
}

export default new AdminManage