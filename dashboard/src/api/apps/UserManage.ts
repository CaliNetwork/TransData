import { generateToken } from "toolbx";
import { requestObject, returnObject, ticketObject, userObject } from "../../misc/type";
import { randomUUID } from "crypto";
import utils from "../../misc/utils";
import { WithId } from "mongodb";

class UserManage {
    async register(contents: requestObject): Promise<returnObject> { //post
        let returnObject: returnObject = {
            succeed: true
        }
        const requestObject = contents.body;
        if (await utils.getUserObject('email', requestObject.email)) {
            throw new Error("This email has been registered");
        } else {
            utils.writeUserObject({
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
        const userObject = await utils.getUserObject('email', requestObject.email);
        if (userObject) {
            if (await Bun.password.verify(requestObject.password, userObject.password)) {
                const newToken = generateToken(32);
                await utils.updateUserObject(userObject._id, {
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
    async resetPassword(requestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject: returnObject = {};
        utils.updateUserObject(userObject._id, {
            password: await Bun.password.hash(requestObject.password),
            token: undefined
        })
        return returnObject
    }
    async modifyTicket(requestObject: any, userObject: WithId<userObject>): Promise<returnObject> {
        let returnObject = {};
        let newTicketObject;
        if (requestObject.ticket_uuid) {
            const ticketObject = await utils.getTicketObject(requestObject.ticket_uuid)
            if (ticketObject) {
                newTicketObject = {
                    instance_uuid: requestObject.instance_uuid,
                    contents: ticketObject.contents + requestObject.contents,
                    isOpen: requestObject.isOpen
                }
                await utils.updateTicketObject(ticketObject._id, newTicketObject)
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
            utils.writeTicketObject(newTicketObject);
        }
        return returnObject
    }
}

export default new UserManage
