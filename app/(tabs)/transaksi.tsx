import { images } from '@/constants/images'
import { useSetTransaksi, useTransaksi } from '@/context/transaksi-context'
import getDatabase from '@/database/sqlite'
import { fetchAllTransaksi } from '@/database/transaksi'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SQLiteDatabase } from 'expo-sqlite'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import 'react-native-get-random-values'



const transaksi = () => {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [database, setDatabase] = useState<SQLiteDatabase | null>(null);
    const dataTransaksi = useTransaksi();
    const setDataTransaksi = useSetTransaksi();

    useEffect(() => {
        const initDb = async() => {
            try {
                const db = await getDatabase();
                setDatabase(db)
            }   catch (err) {
                console.log(err)
            }
        }

        initDb();
    }, [])

    useEffect(() => {
        
        const initData = async() => {
            const data = await fetchAllTransaksi(database);
            setDataTransaksi(data);
        }

        if(database)
            initData()

    }, [database])

    return (
        <View className='flex-1 px-5'>
            <View className="flex justify-center items-center mt-14">
                <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
                <Text className="text-xl font-bold text-blue-500 italic -mt-3">WaroongKU</Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                className='flex-row bg-blue-500 justify-center items-center gap-2 py-5 rounded-md mt-5'
                onPress={() => setOpen(!open)}
            >
                <Ionicons color="#fff" name='time' size={25} />
                <Text className='text-white font-bold text-xl'>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
                modal
                mode='date'
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <ScrollView className="flex" showsVerticalScrollIndicator={false} contentContainerStyle={{
                        paddingBottom: 10
            }}>

                 <FlatList
                    data={dataTransaksi}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            className='w-full bg-white mb-4 p-5 rounded-md' 
                            activeOpacity={0.6}
                            onPress={() => router.push(`/transaksi/${item.id}`)}
                        >
                            <View className='flex-row'>
                                <Text className='font-bold'>#{item.id}</Text>
                                <View className='flex-row justify-center items-center ml-auto gap-2'>
                                    <Ionicons name='calendar' color="#3b82f6" size={20} />
                                    <Text className='font-medium'>{item.tanggal} at {item.waktu}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    
                    className="mt-5 w-full"
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />

            </ScrollView>
        </View>
    )
}

export default transaksi