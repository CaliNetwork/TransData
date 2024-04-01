import { InsertOneResult, UpdateResult, WithId } from "mongodb";
import { db } from "..";
import { siteConfigure, userObject } from "./type";

class Utils {
    async getSiteConfigure(): Promise<null | string | WithId<siteConfigure>> {
        const document = await db.collection('settings').findOne({
            cata: 'siteConfigure'
        }) as WithId<siteConfigure> | null;
        return document
    }
    async writeUserObject(userObject: userObject): Promise<InsertOneResult> {
        return await db.collection('users').insertOne(userObject)
    }
    async getUserObject(type: string, query: string): Promise<null | WithId<userObject>> { //fixme
        let document = null;
        switch (type) {
            case 'uuid':
                document = await db.collection('users').findOne({
                    uuid: query
                }) as WithId<userObject> | null;
                break;
            case 'email':
                document = await db.collection('users').findOne({
                    email: query
                }) as WithId<userObject> | null;
                break;
            case 'token':
                document = await db.collection('users').findOne({
                    token: query
                }) as WithId<userObject> | null;
                break;
            default:
                throw new Error(`utils.getUserObject unknown query type ${type}`)
        }
        return document
    }
    async updateUserObject(user_uuid: string, updateObject: object): Promise<UpdateResult> {
        return await db.collection('users').updateOne({
            uuid: user_uuid
        }, {
            $set: updateObject
        })
    }
}

export default new Utils