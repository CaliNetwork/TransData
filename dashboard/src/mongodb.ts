import { MongoClient } from "mongodb";
import { logger } from "toolbx";

export const database = async (url: string) => {
    let isOnline: boolean = false

    const client = await MongoClient.connect(url);

    await client.connect();

    client.on('serverHeartbeatFailed', () => {
        logger('> Reconnecting to the database', 3);
        isOnline = false;
    });

    client.on('serverHeartbeatSucceeded', () => {
        if (!isOnline) {
            logger('> Connected to the database', 1);
        }
        isOnline = true;
    });

    return client.db('transdata');
}