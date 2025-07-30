import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";

interface transaksi {
    database: SQLiteDatabase | null
    uuid: string
    id_barang: string
    quantity: number
    total_harga: number
}

export const addNewTransaksi = async({database, id_barang, quantity, total_harga, uuid}: transaksi) => {
    if(!database)
        return Alert.alert("Error", "Gagal mengambil database");

    const date = new Date().toISOString().substring(0, 10);
    const dateTime = new Date().toLocaleTimeString()
    
    try {
        await database.execAsync(`
            INSERT OR IGNORE INTO transaksi (detail_id, tanggal, waktu) VALUES ('${uuid}', '${date}', '${dateTime}');
            INSERT INTO detail_transaksi (id, id_barang, quantity, total_harga) VALUES ('${uuid}', '${id_barang}', ${quantity}, ${total_harga});
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
            SELECT barang.nama_barang, detail_transaksi.quantity, barang.harga
            FROM barang
            INNER JOIN
            detail_transaksi
            WHERE barang.id = detail_transaksi.id_barang AND detail_transaksi.id = '${detail_id}'
        `)

    } catch(err){
        console.log(err)
    }

    return response;
}