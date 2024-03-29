import { dataObject, requestObject, resultObject } from "../type"

export const Gateway = async (content: requestObject, app: () => Promise<string>): Promise<string> => {
    let result:resultObject  = {
        succeed: false,
        msg: "",
        data: undefined
    }

    return JSON.stringify(result)
}