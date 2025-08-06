import { images } from '@/constants/images';
import { useDatabase } from '@/context/database-context';
import { useTransaksi } from '@/context/transaksi-context';
import { fetchDetailTransaksi } from '@/database/transaksi';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface detailTransaksi {
    nama_pembeli: string
    nama_barang: string
    harga: number
    quantity: number
}

const DetailTransaksi = () => {
    const [data, setData] = useState<detailTransaksi[] | []>([]);
    const dataTransaksi = useTransaksi();
    const { id } = useLocalSearchParams();
    const target = dataTransaksi.find((item) => item.id === Number(id))
    const database = useDatabase()

    if(!target)
        return router.back();
    
    useEffect(() => {
        
        const initData = async() => {
            const data = await fetchDetailTransaksi(database, target.detail_id);
            setData(data);
        }

        if(database)
            initData()

    }, [])

    const totalHarga = useMemo(() => {
        return data.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    }, [data]);


    return (
        <View className='flex'>
            <View className='flex-row justify-between items-center px-5 mt-14'>
                <TouchableOpacity onPress={router.back}>
                    <Image source={images.arrowleft} className='size-7'/>
                </TouchableOpacity>
                <Text className='font-bold text-xl mx-auto'>Detail Transaksi</Text>
            </View>
            

                 <FlatList
                    data={data}
                    renderItem={({item}) => (
                        <View className='flex-row bg-white rounded-md p-5 w-full mb-4'>
                            <View>
                                <Text className='font-bold'>{item.nama_barang}</Text>
                                <Text className='mt-1'>Rp. {item.harga.toLocaleString()}</Text>
                            </View>
                            <View className='flex-row items-end ml-auto gap-2'>
                                <View className='px-5 py-2.5 rounded-md border border-gray-500'>
                                    <Text className='font-bold'>{item.quantity} x {item.harga.toLocaleString()} = {(item.quantity * item.harga).toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <Text className='font-semibold mb-2'>Nama Pembeli: {data.at(0)?.nama_pembeli}</Text>
                    )}
                    className="mt-5 px-5 w-full"
                    keyExtractor={(item) => item.nama_barang}
                    ListFooterComponent={() => (
                        <Text className='px-5 font-bold text-center text-xl'>Total Harga: Rp.{totalHarga.toLocaleString()}</Text>
                    )}
                />

                

        </View>
    )
}

export default DetailTransaksi