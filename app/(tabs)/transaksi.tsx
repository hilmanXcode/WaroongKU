import { images } from '@/constants/images'
import { useDatabase } from '@/context/database-context'
import { useSetTransaksi, useTransaksi } from '@/context/transaksi-context'
import { fetchAllTransaksi } from '@/database/transaksi'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from "@shopify/flash-list"
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'
import 'react-native-get-random-values'

interface transaksi {
    id: number
    detail_id?: string
    tanggal: string
    waktu: string
}

const CardTransaksi = ({id, tanggal, waktu}: transaksi) => {
    
    return (
        <TouchableOpacity
            className='w-full bg-white mb-4 p-3 rounded-md' 
            activeOpacity={0.6}
            onPress={() => router.push({ pathname: "/transaksi/[id]", params: { id: id.toString() } })}
        >
            <View className='flex-row justify-center items-center gap-2'>
                <View className='bg-blue-500 p-5 rounded-md'>
                    <Ionicons name='cart-sharp' size={20} color="#fff"/>
                </View>
                <View>
                    <Text className='font-bold text-sm'>Transaction ID</Text>
                    <Text className='text-sm'>{id}</Text>
                </View>
                <View className='flex-row justify-center items-center ml-auto gap-2'>
                    <Ionicons name='calendar' color="#3b82f6" size={20} />
                    <Text className='font-medium text-sm'>{tanggal} at {waktu}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}



const transaksi = () => {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const database = useDatabase();
    const dataTransaksi = useTransaksi();
    const setDataTransaksi = useSetTransaksi();
    const [searchedData, setSearchedData] = useState<transaksi[]>([])
    const [toggleFilter, setToggleFilter] = useState(false);

    useEffect(() => {
        
        const initData = async() => {
            const data = await fetchAllTransaksi(database);
            setDataTransaksi(data);
        }

        if(database)
            initData()

    }, [])

    useEffect(() => {
        const formatedDate = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const data = dataTransaksi.filter((item) => item.tanggal === formatedDate)
        
        setSearchedData(data)
    }, [toggleFilter])

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
                <Text className='text-white font-bold text-xl'>{date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                className={`flex-row ${toggleFilter ? 'bg-red-500' : 'bg-blue-500'} justify-center items-center gap-2 py-2 rounded-md mt-2`}
                onPress={() => setToggleFilter(!toggleFilter)}
            >
                <Ionicons color="#fff" name='filter-circle' size={25} />
                <Text className='text-white font-bold text-xl'>
                    {toggleFilter ? 'Disable Filter' : 'Apply Filter'}
                </Text>
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
            
                <FlashList
                    data={toggleFilter ? searchedData.sort((a, b) => a.tanggal.localeCompare(b.tanggal)) : dataTransaksi.sort((a, b) => a.tanggal.localeCompare(b.tanggal))}
                    renderItem={({item}) => (
                        <CardTransaksi {...item} />
                    )}
                    className='mt-5 w-full'
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={() => (
                        <Text>Data Kosong</Text>
                    )}
                    estimatedItemSize={91}
                    
                />

        </View>
    )
}

export default transaksi