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
    async getObject(cata: string, key: string, query: string): Promise<null | WithId<object>> {
        if (!collections.includes(cata)) throw new Error("getObject -> collection ${cata} is invaild");
        const document = await db.collection(cata).findOne({
            [key]: query
        });
        return document
    }
    async getManyObject(cata: string, key: string, query: string): Promise<null | WithId<object>[]> {
        if (!collections.includes(cata)) throw new Error("getObject -> collection ${cata} is invaild");
        const document: WithId<object>[] | null = [];
        const cursor = db.collection(cata).find({
            [key]: query
        })
        for await (let docWithID of cursor) {
            const { _id, document } = docWithID
            document.push(document)
        }
        return document
    }
}

export default new Utils