import { images } from '@/constants/images';
import { useDatabase } from '@/context/database-context';
import { useHutang, useSetHutang } from '@/context/hutang-context';
import { fetchAllHutang, fetchDetailHutang, updateHutang } from '@/database/hutang';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';


interface detailHutang {
    id: string
    nama_pembeli: string
    nama_barang: string
    harga: number
    quantity: number
}

interface modalProps {
    modalValue: boolean
    setModalValue: (status: boolean) => void;
    namaPembeli: string | undefined
    database: SQLiteDatabase | null
}

const BayarHutangModal = ({modalValue, setModalValue, namaPembeli, database}: modalProps) => {

    if(!database)
        Alert.alert("Error", "Koneksi ke database gagal");

    const [nominal, setNominal] = useState(0);
    const setDataHutang = useSetHutang();

    const handleSubmit = async() => {
        try {
            await updateHutang(database, nominal, namaPembeli)
        } catch (err){
            console.log(err)
            throw err
        } finally {
            const data = await fetchAllHutang(database);
            setDataHutang(data);
            setModalValue(!modalValue);
            setNominal(0);
        }
    }

    return (
        <Modal
                visible={modalValue}
                transparent
                animationType="fade"
                onRequestClose={() => setModalValue(!modalValue)}
            >
                <View className="flex-1 items-center justify-center bg-black/50">
                <View className="w-11/12 bg-white rounded-md shadow-md p-6">
                    <View className="flex-row items-center justify-between pb-4">
                        <View className='flex-row items-center gap-2'>
                        <Ionicons name='cash-outline' size={25} color="#000" className='font-bold' />
                        <Text className="text-xl font-bold">
                            Bayar Hutang {namaPembeli}
                        </Text>
                        </View>
                        
                    <Pressable onPress={() => setModalValue(!modalValue)}>
                        <Text className="text-gray-400 text-lg">✖</Text>
                    </Pressable>
                    </View>
        
                    <View className="my-2">
                        <View>
                            <Text className="text-base font-medium">
                                Masukkan Nominal <Text className="text-red-600">*</Text>
                            </Text>
                            <TextInput
                                keyboardType='numeric'
                                value={nominal.toString()}
                                onChangeText={(value: string) => setNominal(Number(value))}
                                className="w-full px-3 py-2 border border-slate-500 rounded mt-1 text-black"
                            />
                        </View>
                    </View>
        
                    <View className="flex-row w-full pt-2">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="bg-blue-500 py-4 w-full rounded-md flex-row gap-2 items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Ionicons name='checkbox-outline' color="#fff" size={20} />
                            <Text className="text-white text-base text-center font-bold">Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
        </Modal>
    )
}

const DetailHutang = () => {
    const [data, setData] = useState<detailHutang[] | []>([])
    const { id } = useLocalSearchParams();
    const dataHutang = useHutang();
    const target = dataHutang.find((item) => item.id === Number(id))
    const database = useDatabase()
    const [hutangModal, setHutangModal] = useState(false);

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

            <BayarHutangModal modalValue={hutangModal} setModalValue={setHutangModal} namaPembeli={data.at(0)?.nama_pembeli} database={database} />

            <FlashList

                data={data}
                renderItem={({item}) => (
                    <View className='flex-row bg-white items-center gap-2 rounded-md p-3 w-full mb-4'>
                        <View className='bg-blue-500 p-5 rounded-md'>
                            <Ionicons name='logo-dropbox' size={20} color="#fff"/>
                        </View>
                        <View>
                            <Text className='font-bold'>Nama Barang</Text>
                            <Text className='mt-1 w-32 line-clamp-2'>{item.nama_barang}</Text>
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
                    <>
                        {target.total_bayar >= totalHarga ? (
                            <View>
                                <Text className='mb-5 font-bold'>Total Bayar Hutang : Rp. {target.total_bayar.toLocaleString()}</Text>
                                <View
                                    className='w-full bg-green-500 mb-3 p-5 rounded-md' 
                                    >
                                    
                                    <View className='flex-row justify-center items-center gap-2'>
                                        <View>
                                            <Text className='font-semibold text-white text-xl'>Hutang Lunas</Text>
                                        </View>
                                        <View>
                                            <Ionicons name='checkbox-outline' size={20} color="#fff"/>
                                        </View>
                                        
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <>
                                <View
                                    className='w-full bg-white mb-3 p-3 rounded-md' 
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
                                <TouchableOpacity
                                    activeOpacity={0.8} 
                                    className='bg-blue-500 p-5 rounded-md'
                                    onPress={() => setHutangModal(!hutangModal)}
                                >
                                    <View className='flex-row justify-center items-center gap-2'>
                                        <View className='bg-blue-500 rounded-md'>
                                            <Ionicons name='cash-sharp' size={20} color="#fff"/>
                                        </View>
                                        <View>
                                        <Text className='text-xl font-bold text-white'>Bayar Hutang</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}


                        
                        
                    </>
                )}  
            />
                
                

        </View>
    )
}

export default DetailHutang