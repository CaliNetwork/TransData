import { WithId } from "mongodb";
import { db } from ".";
import { siteConfigure, userObject } from "./type";

class Utils {
    async getSiteConfigure(): Promise<null | string | WithId<siteConfigure>> {
        try {
            const document = await db.collection('settings').findOne({
                cata: 'siteConfigure'
            }) as WithId<siteConfigure> | null;
            return document
        } catch (error) {
            return JSON.stringify(error)
        }
    }
    async getUserObject(queryString: string): Promise<null | string | WithId<userObject>> { //fixme
        try {
            const document = await db.collection('users').findOne({
                cata: 'siteConfigure' 
            }) as WithId<userObject> | null;
            return document
        } catch (error) {
            return JSON.stringify(error)
        }
    }
}

export default new Utils