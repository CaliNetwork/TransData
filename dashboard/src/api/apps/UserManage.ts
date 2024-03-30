import { requestObject, returnObejct } from "../../misc/type";

class UserManage {
    async register(contents: requestObject): Promise<returnObejct> { //post
        const requestObject = JSON.parse(contents.body);

    }
    async getToken(): Promise<returnObejct> { //get
    }
    async resetPassword(): Promise<returnObejct> { //get

    }
}

export default new UserManage