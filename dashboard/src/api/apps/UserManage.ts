import { generateToken } from "toolbx";
import { orderConfigure, requestObject, returnObject, ticketObject, userObject, orderObject, InstanceObject } from "../../misc/type";
import { randomUUID } from "crypto";
import utils from "../../misc/utils";
import { WithId } from "mongodb";

class UserManage {
    async register(contents: requestObject): Promise<returnObject> { //post
        let returnObject: returnObject = {
            succeed: true
        }
        const requestObject = contents.body;
        if (await utils.getObject('user', 'email', requestObject.email)) {
            throw new Error("This email has been registered");
        } else {
            utils.writeObject('user', {
                ...requestObject,
                password: await Bun.password.hash(requestObject.password),
                isbanned: false,
                balance: 0,
                register_on: Math.floor(new Date().getTime() / 1000),
                isAdmin: false
            })
        }
        return returnObject
    }
    async getToken(contents: requestObject): Promise<returnObject> { //get
        let returnObject: returnObject = {
            succeed: true
        }
        const requestObject = contents.body;
        const userObject = await utils.getObject('user', 'email', requestObject.email) as WithId<userObject> | null;
        if (userObject) {
            if (await Bun.password.verify(requestObject.password, userObject.password)) {
                const newToken = generateToken(32);
                await utils.updateObject('user', userObject._id, {
                    uuid: randomUUID(),
                    token: newToken
                });
                returnObject.data = newToken;
            }
        } else {
            throw new Error("User Not Found or password incorrect");
        }
        return returnObject
    }
    async resetPassword(fullRequestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        utils.updateObject('user', userObject._id, {
            password: await Bun.password.hash(requestObject.password),
            token: undefined
        })
        return returnObject
    }
    async modifyTicket(fullRequestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        let newTicketObject;
        if (requestObject.uuid) {
            const ticketObject = await utils.getObject('ticket', 'uuid', requestObject.uuid) as WithId<ticketObject> | null
            if (ticketObject) {
                newTicketObject = {
                    instance_uuid: requestObject.instance_uuid,
                    contents: ticketObject.contents + '\n' + requestObject.contents,
                    isOpen: requestObject.isOpen
                }
                await utils.updateObject('ticket', ticketObject._id, newTicketObject)
            } else {
                throw new Error("Ticket not found");
            }
        } else {
            newTicketObject = {
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
    async placeOrder(fullRequestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        const uuid = randomUUID();
        const drop_wait = await utils.getObject('setting', 'cata', 'order') as WithId<orderConfigure>
        // add template logic here
        await utils.writeObject('order', {
            uuid: uuid,
            user_uuid: userObject.uuid,
            template_uuid: requestObject.template_uuid,
            instance_uuid: randomUUID(),
            status: 'pending',
            droptime: Math.floor(new Date().getTime() / 1000) + drop_wait.drop_wait
        })
        returnObject.data = uuid;
        return returnObject
    }
    async cancelOrder(fullRequestObject: any, _userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        const orderObject = await utils.getObject('order', 'uuid', requestObject.uuid) as WithId<orderObject> | null;
        if (orderObject) {
            await utils.updateObject('order', orderObject._id, {
                status: 'cancel'
            })
        } else {
            throw new Error("Order not found");
        }
        return returnObject
    }
    async vmInstanceManage(fullRequestObject: any, _userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        const action: string[] = ['reboot', 'shutdown', 'boot', 'rebuild', 'rename']
        if (!action.includes(requestObject.action)) throw new Error("Invaild action");
        const InstanceObject = await utils.getObject('Instance', 'uuid', requestObject.uuid);
        if (InstanceObject) {
            // Reminder: Add cluster driver app here
        } else {
            throw new Error("Instance not found");
        }
        return returnObject
    }
    async pfInstanceManage(fullRequestObject: any, _userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        const requestObject = fullRequestObject.body;
        const InstanceObject = await utils.getObject('Instance', 'uuid', requestObject.uuid) as WithId<InstanceObject> | null;
        if (InstanceObject) {
            const newInstanceObject = {
                name: requestObject.name && requestObject.name,
                details: requestObject.to && requestObject.to
            }
            await utils.updateObject('instance', InstanceObject._id, newInstanceObject)
        } else {
            throw new Error("Instance not found")
        }
        return returnObject
    }
}

export default new UserManage
