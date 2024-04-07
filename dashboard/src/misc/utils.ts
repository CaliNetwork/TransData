import { InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { db } from "..";
import { billingConfigure, billingObject, clusterConfigure, InstanceObject, orderConfigure, orderObject, InstanceTemplate, InstanceTemplateObject, siteConfigure, ticketObject, userObject } from "./type";

const collections: string[] = [
    'user',
    'Instance',
    'billing',
    'ticket',
    'order',
    'setting'
]

class Utils {
    async writeObject(cata: string, object: userObject | InstanceObject | billingObject | ticketObject | orderObject | orderConfigure | billingConfigure | clusterConfigure | siteConfigure | InstanceTemplate): Promise<InsertOneResult> {
        if (!collections.includes(cata)) throw new Error("writeObject -> collection ${cata} is invaild");
        return await db.collection(cata).insertOne(object)
    }
    async updateObject(cata: string, objectID: ObjectId, updateObject: object): Promise<UpdateResult> {
        if (!collections.includes(cata)) throw new Error("updateObject -> collection ${cata} is invaild");
        return await db.collection(cata).updateOne({
            _id: objectID
        }, {
            $set: updateObject
        })
    }
    async getObject(cata: string, key: string, query: string, quantity?: number, forceArray?: boolean): Promise<null | WithId<object>[] | WithId<object>> {
        if (!collections.includes(cata)) throw new Error("getObject -> collection ${cata} is invaild");
        let document: WithId<object>[] | null = [];
        let cursor = db.collection(cata).find({
            [key]: query
        })
        if (quantity) {
            cursor = cursor.limit(quantity);
        } else {
            cursor = cursor.limit(1);
        }
        for await (let docWithID of cursor) {
            const { _id, document } = docWithID
            document.push(document)
        }
        if (document.length > 1) {
            return document
        } else {
            return forceArray ? document : document[0]
        }
    }
}

export default new Utils