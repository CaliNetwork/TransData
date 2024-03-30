import { requestObject } from "./type";

export const test = async (contents: requestObject) => {
    return JSON.stringify(contents)
}