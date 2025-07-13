import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface barangDb {
    database: SQLiteDatabase | null
    id_barang?: string | string[]
    nama_barang?: string
    barcode?: string
    harga?: number
}

interface barang {
    id: string
    nama_barang: string
    barcode: string
    harga: number
}

export const addNewBarang = async ({ database, nama_barang, barcode, harga }: barangDb) => {
    if(!database)
      return Alert.alert("Koneksi Ke Database Error");

    const uuid = uuidv4();

    try {
      await database.execAsync(`
        INSERT INTO barang (id, nama_barang, barcode, harga) VALUES ('${uuid}', '${nama_barang}', '${barcode}', '${harga}')
      `)
    } catch(err){
      console.error(err);
      throw Error("Gagal menambahkan barang baru");
    }
    

}

export const fetchAllBarang = async ({database}: barangDb) => {
    if(!database)
        return Alert.alert("Koneksi Ke Database Error");

    let result: barang[] = [];

    try {
        const results: barang[] = await database.getAllAsync("SELECT * FROM barang");
        result = results;
    } catch (err){
        console.error(err);
        throw Error('Gagal mengambil data barang')
    }

    return result;
}

export const editBarang = ({ database, id_barang, nama_barang, barcode, harga }: barangDb) => {
    if(!database)
        return Alert.alert("Gagal mendapatkan koneksi ke database");

    try {
        database.execAsync(`
            UPDATE barang SET nama_barang='${nama_barang}', barcode='${barcode}', harga='${harga}'
            WHERE id='${id_barang}'
        `);    
    } catch(err){
        console.error(err);
    }
    
}