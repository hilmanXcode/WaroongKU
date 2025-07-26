import transaksi from "@/app/(tabs)/transaksi";
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
    
    try {
        await database.execAsync(`
            INSERT OR IGNORE INTO transaksi (detail_id, tanggal) VALUES ('${uuid}', '${date}');
            INSERT INTO detail_transaksi (id, id_barang, quantity, total_harga) VALUES ('${uuid}', '${id_barang}', ${quantity}, ${total_harga});
        `)

    } catch(err){
        console.log(err)
        throw err
    } 
}