import { InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { db } from "..";
import { siteConfigure, ticketObject, userObject } from "./type";

class Utils {
    // User
    async getSiteConfigure(): Promise<null | string | WithId<siteConfigure>> {
        const document = await db.collection('setting').findOne({
            cata: 'siteConfigure'
        }) as WithId<siteConfigure> | null;
        return document
    }
    async writeUserObject(userObject: userObject): Promise<InsertOneResult> {
        return await db.collection('user').insertOne(userObject)
    }
    async getUserObject(type: string, query: string): Promise<null | WithId<userObject>> { //fixme
        let document = null;
        switch (type) {
            case 'uuid':
                document = await db.collection('user').findOne({
                    uuid: query
                }) as WithId<userObject> | null;
                break;
            case 'email':
                document = await db.collection('user').findOne({
                    email: query
                }) as WithId<userObject> | null;
                break;
            case 'token':
                document = await db.collection('user').findOne({
                    token: query
                }) as WithId<userObject> | null;
                break;
            default:
                throw new Error(`utils.getUserObject unknown query type ${type}`)
        }
        return document
    }
    async updateUserObject(objectID: ObjectId, updateObject: object): Promise<UpdateResult> {
        return await db.collection('user').updateOne({
            _id: objectID
        }, {
            $set: updateObject
        })
    }
    // Ticket
    async writeTicketObject(ticketObject: ticketObject): Promise<InsertOneResult> {
        return await db.collection('ticket').insertOne(ticketObject)
    }
    async getTicketObject(ticket_uuid: string): Promise<null | WithId<ticketObject>> {
        const document = await db.collection('ticket').findOne({
            uuid: ticket_uuid
        }) as  WithId<ticketObject> | null;
        return document
    }
    async updateTicketObject(objectID: ObjectId, updateObject: object): Promise<UpdateResult> {
        return await db.collection('ticket').updateOne({
            _id: objectID
        }, {
            $set: updateObject
        })
    }
}

export default new Utils