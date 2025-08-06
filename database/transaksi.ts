import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";

interface transaksi {
    database: SQLiteDatabase | null
    uuid: string
    nama_barang: string
    nama_pembeli: string
    harga: number
    quantity: number
}

export const addNewTransaksi = async({database, nama_barang, nama_pembeli, harga, quantity, uuid}: transaksi) => {
    if(!database)
        return Alert.alert("Error", "Gagal mengambil database");

    const date = new Date().toISOString().substring(0, 10);
    const dateTime = new Date().toLocaleTimeString()
    
    try {
        await database.execAsync(`
            INSERT OR IGNORE INTO transaksi (detail_id, tanggal, waktu) VALUES ('${uuid}', '${date}', '${dateTime}');
            INSERT INTO detail_transaksi (id, nama_pembeli, nama_barang, harga, quantity) VALUES ('${uuid}', '${nama_pembeli}', '${nama_barang}', ${harga}, ${quantity});
        `)

    } catch(err){
        console.log(err)
        throw err
    } 
}

export const fetchAllTransaksi = async(database: SQLiteDatabase | null) => {
    if(!database)
        return Alert.alert("Error", "Gagal mengambil database");

    let response: any = [];

    try {
        response = await database.getAllAsync(`
            SELECT id, detail_id, strftime('%d/%m/%Y', tanggal) as tanggal, waktu FROM transaksi;
        `)

    } catch (err) {
        console.log(err)
    }

    return response;
}

export const fetchDetailTransaksi = async(database : SQLiteDatabase | null, detail_id: string) => {
    if(!database)
        return Alert.alert("Error", "Gagal mengambil database");

    if(!detail_id)
        return Alert.alert("Error", "Detail ID diperlukan!");

    let response: any = [];

    try {
        response = await database.getAllAsync(`
            SELECT * FROM detail_transaksi WHERE id = '${detail_id}'
        `)

    } catch(err){
        console.log(err)
    }

    return response;
}