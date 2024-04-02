import { generateToken } from "toolbx";
import { requestObject, returnObject, userObject } from "../../misc/type";
import { randomUUID } from "crypto";
import utils from "../../misc/utils";

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
                await utils.updateUserObject(userObject.uuid, {
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
    async resetPassword(contents: requestObject, userObject: userObject): Promise<returnObject> { //get
        let returnObject: returnObject = {};

        const requestObject = contents.body;
        utils.updateUserObject(userObject.uuid, {
            password: await Bun.password.hash(requestObject.password),
            token: undefined
        })
        return returnObject
    }
}

export default new UserManage
