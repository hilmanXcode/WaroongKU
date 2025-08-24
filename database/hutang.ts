
                        

import { SQLiteDatabase } from "expo-sqlite"
import { Alert } from "react-native"

interface hutang {
    database: SQLiteDatabase | null
    uuid: string
    nama_pembeli: string
    total_bayar: number
    nama_barang: string
    harga: number
    quantity: number
}

interface dataHutang {
    detail_hutang: string
    total_bayar: number
}

interface allDataHutang {
    id: number
    detail_hutang: string
    nama_pembeli: string
    total_bayar: number
    tanggal: string
    waktu: string
    total_hutang: number
}

interface detailHutang {
    id: string
    nama_pembeli: string
    nama_barang: string
    harga: number
    quantity: number
}

export const checkHutang = async(database: SQLiteDatabase, nama_pembeli: string) => {
    try {
        const query = `SELECT detail_hutang, total_bayar FROM hutang WHERE nama_pembeli = '${nama_pembeli}';`;
        const result: dataHutang | null = await database.getFirstAsync(query);

        return result
  } catch (error) {
    console.error("Error checking if row exists:", error);
    return false;
  }
}


export const addOrUpdateHutang = async({database, uuid, nama_pembeli, total_bayar, nama_barang, harga, quantity}: hutang) => {
    if(!database)
        return Alert.alert("Error", "Koneksi ke database error")

    const date = new Date().toISOString().substring(0, 10);
    const dateTime = new Date().toLocaleTimeString()

    try {

        const data = await checkHutang(database, nama_pembeli);
        if(data){

            const updateTotal = data.total_bayar += total_bayar;
            await database.execAsync(`
                UPDATE hutang SET total_bayar = ${updateTotal}, tanggal = '${date}', waktu = '${dateTime}' WHERE nama_pembeli = '${nama_pembeli}';

                INSERT INTO detail_hutang VALUES ('${data.detail_hutang}', '${nama_pembeli}', '${nama_barang}', ${harga}, ${quantity});
            `)

        }
        else {
            await database.execAsync(`
                INSERT OR IGNORE INTO hutang (detail_hutang, nama_pembeli, total_bayar, tanggal, waktu) VALUES ('${uuid}', '${nama_pembeli}', ${total_bayar}, '${date}', '${dateTime}');

                INSERT INTO detail_hutang VALUES ('${uuid}', '${nama_pembeli}', '${nama_barang}', ${harga}, ${quantity});
            `)
        }

    } catch(err){
        console.log(err)
        throw err
    }
}

export const updateHutang = async(database: SQLiteDatabase | null, total_bayar: number, nama_pembeli: string | undefined) => {
    if(!database)
        return Alert.alert("Error", "Koneksi ke database gagal")

    if(!nama_pembeli)
        return Alert.alert("Error", "Nama pembeli tidak ditemukan")

    const date = new Date().toISOString().substring(0, 10);
    const dateTime = new Date().toLocaleTimeString()

    try {
        const data = await checkHutang(database, nama_pembeli);
        if(!data)
            return Alert.alert("Error", "Data hutang tidak ditemukan")

        const updateTotal = data.total_bayar += total_bayar;

        await database.execAsync(`
            UPDATE hutang SET total_bayar = ${updateTotal}, tanggal = '${date}', waktu = '${dateTime}' WHERE nama_pembeli = '${nama_pembeli}'; 
        `)
    } catch(err){
        console.log(err)
        throw err;
    }
}

export const fetchAllHutang = async(database: SQLiteDatabase | null) => {
    if(!database){
        Alert.alert("Error", "Koneksi ke database gagal")
        return [];
    }

    let response: allDataHutang[] | [];

    try {
        response = await database.getAllAsync("SELECT * FROM hutang");
        
        await Promise.all(
                response.map(async(item) => {
                return item.total_hutang = await fetchTotalHutang(database, item.detail_hutang)
            })
        )
        
    } catch(err){
        console.log(err)
        throw err
    }
    return response;

}

export const fetchDetailHutang = async(database: SQLiteDatabase | null, id: string) => {
    if(!database){
        Alert.alert("Error", "Koneksi ke datbase gagal");
        return [];
    }

    let response: detailHutang[] | []

    try {
        response = await database.getAllAsync(`SELECT * FROM detail_hutang WHERE id = '${id}'`)
    } catch(err){
        console.log(err)
        throw err
    }

    return response;
    
}

export const fetchTotalHutang = async(database: SQLiteDatabase | null, id: string | undefined) => {
    if(!database){
        Alert.alert("Error", "Koneksi ke database gagal");
        return 0;
    }

    let response

    try {
        response = await database.getFirstAsync<{ total_hutang: number }>(`
            SELECT SUM(harga * quantity) AS total_hutang FROM detail_hutang WHERE id = '${id}' 
        `)

        return response?.total_hutang ?? 0
    } catch (err){
        console.log(err)
        throw err
    }

}