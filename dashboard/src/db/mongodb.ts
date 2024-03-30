import { MongoClient } from "mongodb";
import { logger } from "toolbx";
import { hasDebug } from "..";

export const database = async (url: string) => {
    let isOnline: boolean = false
    if (hasDebug) logger('> Connecting to the database', 4)
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