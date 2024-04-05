import { logger, generateToken } from "toolbx";
import { db, hasDebug } from ".."

const setupDB = async (collectionsToCheck: string[]): Promise<void> => {
    try {
        if (hasDebug) logger('debug> Setting up the database', 4)
        collectionsToCheck.forEach((element) => {
            db.createCollection(element);
            if (element === 'settings') {
                db.collection('settings').insertOne(
                    {
                        cata: 'siteConfigure',
                        hasSetup: false,
                        rootKey: generateToken(32)
                    }
                )
            }
        })
        if (hasDebug) logger('debug> Database has been set up', 4)
    } catch (error) {
        logger(`> Failed with trying to set up the database, reason: ${error}`, 2);
        process.exit(4);
    }
}

export const isDBSetup = async (resetDB: boolean): Promise<void> => {
    try {
        if (resetDB) {
            logger('> Resetting the database', 3);
            db.dropDatabase()
        }
        if (hasDebug) logger('debug> Checking if the database has been set up', 4)
        const collectionsToCheck: string[] = [
            'user',
            'Instance',
            'billing',
            'ticket',
            'order',
            'setting'
        ]
        const existingCollections = await db.listCollections().toArray();
        const missingCollections = collectionsToCheck.filter(collection =>
            !existingCollections.find(({ name }) => name === collection)
        );
        if (missingCollections.length > 0) {
            if (missingCollections.length < 6) {
                logger(`> Incomplete database set up detected, please re-run with --resetDB to reset the database`, 2);
                logger(`> Warning: this will delete the whole database`, 2);
                process.exit(2);
            } else {
                await setupDB(collectionsToCheck);
            }
        }
    } catch (error) {
        logger(`> Failed with trying to set up/check the database, reason: ${error}`, 2)
        process.exit(3);
    }

}