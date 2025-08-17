import { images } from '@/constants/images';
import { useDatabase } from '@/context/database-context';
import { useHutang } from '@/context/hutang-context';
import { fetchDetailHutang } from '@/database/hutang';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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
        <View className='flex-1 px-5'>
            <View className='flex-row justify-between items-center mt-14'>
                <TouchableOpacity onPress={router.back}>
                    <Image source={images.arrowleft} className='size-7'/>
                </TouchableOpacity>
                <Text className='font-bold text-xl mx-auto'>Detail Hutang</Text>
            </View>

            <FlashList

                data={data}
                renderItem={({item}) => (
                    <View className='flex-row bg-white items-center gap-2 rounded-md p-3 w-full mb-4'>
                        <View className='bg-blue-500 p-5 rounded-md'>
                            <Ionicons name='logo-dropbox' size={20} color="#fff"/>
                        </View>
                        <View>
                            <Text className='font-bold'>Nama Barang</Text>
                            <Text className='mt-1'>{item.nama_barang}</Text>
                        </View>
                        <View className='flex-row items-end ml-auto gap-2'>
                            <View className='px-5 py-2.5 rounded-md border border-gray-500'>
                                <Text className='font-bold'>{item.quantity} x {item.harga.toLocaleString()} = {(item.quantity * item.harga).toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                )}
                estimatedItemSize={91}
                className="mt-5 w-full"
                keyExtractor={(item, index) => index.toLocaleString()}
                ListHeaderComponent={() => (
                    <View
                        className='w-full bg-white mb-4 p-3 rounded-md' 
                    >
                        <View className='flex-row  items-center gap-2'>
                            <View className='bg-blue-500 p-5 rounded-md'>
                                <Ionicons name='person' size={20} color="#fff"/>
                            </View>
                            <View>
                                <Text className='font-semibold'>Nama Pembeli</Text>
                                <Text className=''>{data.at(0)?.nama_pembeli}</Text>
                            </View>
                            
                        </View>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View
                        className='w-full bg-white mb-10 p-3 rounded-md' 
                    >
                        <View className='flex-row items-center gap-2'>
                            <View className='bg-blue-500 p-5 rounded-md'>
                                <Ionicons name='cash-sharp' size={20} color="#fff"/>
                            </View>
                            <View>
                                <Text className='font-semibold'>Total Harga: Rp.{totalHarga.toLocaleString()}</Text>
                                <Text className=''>Sisa Hutang: Rp.{(totalHarga - target.total_bayar).toLocaleString()}</Text>
                            </View>
                            
                        </View>
                    </View>
                )}  
            />
                
                

        </View>
    )
}

export default DetailHutang