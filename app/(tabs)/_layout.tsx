import { useSetBarang } from '@/context/barang-context'
import { useDatabase, useSetDatabase } from '@/context/database-context'
import { fetchAllBarang } from '@/database/barang'
import getDatabase from '@/database/sqlite'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React, { useEffect } from 'react'
import { Alert } from 'react-native'

const _Layout = () => {
    const database = useDatabase();
    const setDatabase = useSetDatabase();
    const setBarang = useSetBarang();

    useEffect(() => {
        const initDatabase = async() => {
            try {
                const db = await getDatabase()
                if(setDatabase)
                    setDatabase(db)
                else
                    console.log("ERROR SETDATABASE")
            } catch (err){
                console.log(err)
                throw err
            }
        }

        initDatabase();
    }, [])

    useEffect(() => {


        const loadDataBarang = async() => {
            const results = await fetchAllBarang({ database })
            if(results){
                setBarang(results)
            } else {
                Alert.alert("Gagal Mengambil Data Barang!");
            }
        }

        const initTable = async() => {
            if(database){
                try {
                    database.execAsync(`
                        CREATE TABLE IF NOT EXISTS barang (
                            id varchar(255) PRIMARY KEY,
                            nama_barang varchar(255) NOT NULL,
                            barcode varchar(255) NOT NULL,
                            harga int(11) NOT NULL
                        );
    
                        CREATE TABLE IF NOT EXISTS transaksi (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            detail_id varchar(255) NOT NULL,
                            tanggal date NOT NULL,
                            waktu varchar(255) NOT NULL,
                            UNIQUE(detail_id)
                        );
    
                        CREATE TABLE IF NOT EXISTS detail_transaksi (
                            id varchar(255) NOT NULL,
                            nama_barang varchar(255) NOT NULL,
                            harga int(11) NOT NULL,
                            quantity int(11) NOT NULL,
                            total_harga int(11) NOT NULL
                        );

                    `)
                } catch(err){
                    console.log(err)
                    throw err
                }
            }else {
                console.log("ERROR MENGGUNAKAN DATABASE")
            }
        }

        if(database){
            initTable()
            loadDataBarang();
        }

    }, [database])

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Kasir",
                    headerShown: false,
                    tabBarIcon: ({color, size}) => <Ionicons name='cart' color={color} size={size} />
                }}
            />

            <Tabs.Screen
                name="barang"
                options={{
                    title: "Manage Barang",
                    headerShown: false,
                    tabBarIcon: ({color, size}) => <Ionicons name='logo-dropbox' color={color} size={size} />
                }}
            />

            <Tabs.Screen
                name="transaksi"
                options={{
                    title: "Riwayat Transaksi",
                    headerShown: false,
                    tabBarIcon: ({color, size}) => <Ionicons name='time' color={color} size={size} />
                }}
            />
            
            <Tabs.Screen
                name='hutang'
                options={{
                    title: 'Hutang',
                    headerShown: false,
                    tabBarIcon: ({color, size}) => <Ionicons name='cash'  color={color} size={size}/>
                }}
            />
        </Tabs>
    )
}

export default _Layout