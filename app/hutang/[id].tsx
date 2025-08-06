import { images } from '@/constants/images';
import { useDatabase } from '@/context/database-context';
import { useHutang } from '@/context/hutang-context';
import { fetchDetailHutang } from '@/database/hutang';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';


interface detailHutang {
    id: string
    nama_pembeli: string
    nama_barang: string
    harga: number
    quantity: number
}

const DetailHutang = () => {
    const [data, setData] = useState<detailHutang[] | []>([])
    const { id } = useLocalSearchParams();
    const dataHutang = useHutang();
    const target = dataHutang.find((item) => item.id === Number(id))
    const database = useDatabase()

    if(!target)
        return router.back();
    

    useEffect(() => {
        const initData = async() => {
            try {
                const data = await fetchDetailHutang(database, target.detail_hutang);
                setData(data)
            } catch(err){
                console.log(err)
                throw err;
            }
        }

        initData();
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
                <Text className='font-bold text-xl mx-auto'>Detail Hutang</Text>
            </View>
            
            

            <ScrollView className="flex" showsVerticalScrollIndicator={false} contentContainerStyle={{
                paddingBottom: 10
            }}>
                {data.at(0)?.nama_pembeli && (
                    <Text className='px-5 font-semibold mt-5'>Nama Pembeli: {data.at(0)?.nama_pembeli}</Text>
                )}

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
                    
                    className="mt-5 px-5 w-full"
                    keyExtractor={(item, index) => index.toLocaleString()}
                    scrollEnabled={false}
                />

                <Text className='px-5 font-bold text-center text-xl'>Total Harga: Rp.{totalHarga.toLocaleString()}</Text>
                <Text className='px-5 font-bold text-center text-xl pb-28'>Sisa Hutang: Rp.{(totalHarga - target.total_bayar).toLocaleString()}</Text>
                
            </ScrollView>

        </View>
    )
}

export default DetailHutang