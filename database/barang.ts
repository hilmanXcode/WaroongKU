import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";

interface barangDb {
    database: SQLiteDatabase | null
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

    try {
      await database.execAsync(`
        INSERT INTO barang (nama_barang, barcode, harga) VALUES ('${nama_barang}', '${barcode}', '${harga}')
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