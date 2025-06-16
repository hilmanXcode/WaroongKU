import { openDatabaseAsync } from 'expo-sqlite';

const getDatabase = async() => {
    const db = await openDatabaseAsync('warungku.db', {
        useNewConnection: true
    });
    return db;
}

export default getDatabase;