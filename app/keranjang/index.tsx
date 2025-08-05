import { images } from '@/constants/images'
import { useDatabase } from '@/context/database-context'
import { useKeranjang, useSetKeranjang } from '@/context/keranjang-context'
import { useSetTransaksi } from '@/context/transaksi-context'
import { addNewTransaksi, fetchAllTransaksi } from '@/database/transaksi'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { Alert, FlatList, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'


interface Keranjang {
    id: string
    nama_barang: string,
    harga: number,
    quantity: number
    handleIncrement: () => void;
    handleDecrement: () => void;
}




const CardKeranjang = ({id, nama_barang, harga, quantity, handleDecrement, handleIncrement}: Keranjang) => {
    return (
        <View className='flex-row bg-white rounded-md p-5 w-full mb-5'>
            <View>
                <Text className='font-bold'>{nama_barang}</Text>
                <Text className='mt-1'>Rp. {harga.toLocaleString()}</Text>
            </View>
            <View className='flex-row items-end ml-auto gap-2'>
                <TouchableOpacity onPress={handleDecrement} activeOpacity={0.8} className='px-5 bg-red-500 py-2.5 rounded-md'>
                    <Text className='font-bold text-white'>-</Text>
                </TouchableOpacity>
                <View className='px-5 py-2.5 rounded-md border border-gray-500'>
                    <Text className='font-bold'>{quantity}</Text>
                </View>
                <TouchableOpacity onPress={handleIncrement} activeOpacity={0.8} className='px-5 bg-green-500 py-2.5 rounded-md'>
                    <Text className='font-bold text-white'>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const index = () => {
    const database = useDatabase();
    const keranjang = useKeranjang();
    const setKeranjang = useSetKeranjang();
    const [modalPayment, setModalPayment] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [cashPayment, setCashPayment] = useState(0);
    const setDataTransaksi = useSetTransaksi();

    const totalHarga = useMemo(() => {
        return keranjang.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    }, [keranjang]);

    const handleIncrement = useCallback((id: string, nama_barang: string, barcode: string, harga: number) => {
        if(keranjang.find((item) => item.id === id)){
        setKeranjang(prevKeranjang => {
            return prevKeranjang.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item)    
        });
        }
        else {
        setKeranjang((keranjang) => [
            ...keranjang,
            {id: id, nama_barang: nama_barang, barcode: barcode, harga: harga, quantity: 1}
        ])
        }
    }, [keranjang, setKeranjang])
  

    const handleDecrement = useCallback(async(id: string) => {
        
    
        setKeranjang(prev =>
            prev.map(item => {
                if(item.id === id){
                    if(item.quantity === 1) return null;
                    item.quantity -= 1;
                }
                return item;
            }).filter(item => item !== null)
        );
    }, [keranjang, setKeranjang]);

    const handlePayment = async() => {
        if(!database)
            return Alert.alert("Error", "Gagal mengambil database");

        const uuid = uuidv4();

        try {
            // add data transaksi
            keranjang.map(async(item) => {
                await addNewTransaksi({database, id_barang: item.id, quantity: item.quantity, total_harga: item.harga * item.quantity, uuid});
            })
        } catch (err){
            console.log(err)
        } finally {
            // update data transaksi
            const data = await fetchAllTransaksi(database);
            setDataTransaksi(data);
            setModalPayment(!modalPayment);
            setSuccessModal(true);
            setKeranjang([]);
        }
    }



    return (
        <>
            <View className='flex'>
                <View className='flex-row justify-between items-center px-5 mt-14'>
                    <TouchableOpacity onPress={router.back}>
                        <Image source={images.arrowleft} className='size-7'/>
                    </TouchableOpacity>
                    <Text className='font-bold text-xl mx-auto'>Keranjang</Text>
                    <TouchableOpacity onPress={() => router.push("/scanner")}>
                        <Image source={images.barcode} className='size-7'/>
                    </TouchableOpacity>

                </View>
                <View className='flex-col gap-4 items-center px-5 mt-10'>
                    <FlatList
                        data={keranjang}
                        renderItem={({item}) => (
                            <CardKeranjang {...item} handleIncrement={() => handleIncrement(item.id, item.nama_barang, item.barcode, item.harga)} handleDecrement={() => handleDecrement(item.id)} />     
                        )}
                        keyExtractor={(item) => item.id}
                        
                        className="w-full"
                        ListEmptyComponent={(
                            <View className='flex justify-center items-center h-screen '>
                                <View className='-mt-56'>
                                    <Image source={images.emptyCart} className='w-52 h-52 mx-auto' />
                                    <Text className='text-center font-bold'>Scan/Cari barang untuk menambahkan ke keranjang</Text>
                                </View>
                            </View>
                        )}
                        />
                </View>
                {/* Modal Pembayaran */}
                <Modal
                    visible={modalPayment}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setModalPayment(!modalPayment)}
                >
                    <View className="flex-1 items-center justify-center bg-black/50">
                    <View className="w-11/12 bg-white rounded-md shadow-md p-6">
                        <View className="flex-row items-center justify-between pb-4">
                        <Text className="text-xl font-semibold">Pembayaran</Text>
                        <Pressable onPress={() => setModalPayment(!modalPayment)}>
                            <Text className="text-gray-400 text-lg">✖</Text>
                        </Pressable>
                        </View>

                        <View className="my-2">
                            <Text className='font-bold'>Detail Pembelian: </Text>
                            {keranjang.map((item) => (
                                <View className='flex-row mt-1' key={item.id}>
                                    <Text>{item.nama_barang} {item.quantity}x</Text>
                                    <Text className='ml-auto'>Rp. {(item.harga * item.quantity).toLocaleString()}</Text>
                                </View>
                            ))}

                            <View className='flex-row mt-1'>
                                <Text className='font-bold'>Total Harga: </Text>
                                <Text className='ml-auto font-bold'>Rp. {totalHarga.toLocaleString()}</Text>
                            </View>
                            <View className='flex-row mt-1'>
                                <Text className='font-bold'>{cashPayment >= totalHarga ? "Kembalian" : "Uang Kurang"}: </Text>
                                <Text className='ml-auto font-bold'>Rp. {(cashPayment - totalHarga).toLocaleString()}</Text>
                            </View>
                            
                            <View className='mt-2'>
                                <Text className="text-base font-medium">
                                    Masukkan uang pembeli <Text className="text-red-600">*</Text>
                                </Text>
                                <TextInput
                                    keyboardType="numeric"
                                    value={cashPayment.toString()}
                                    onChangeText={(number: string) => setCashPayment(Number(number))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                                />
                            </View>
                        </View>

                        <View className="flex-row w-full pt-2">
                            <Pressable
                                onPress={handlePayment}
                                className="bg-blue-500 py-2 px-4 w-full rounded-md flex-row gap-2 items-center justify-center"
                            >
                                <Ionicons name='cash' color="#fff" size={20} />
                                <Text className="text-white text-base text-center font-bold">Bayar Sekarang</Text>
                            </Pressable>
                        </View>
                    </View>
                    </View>
                </Modal>
                {/* End Of Modal Pembayaran */}
                {/* Modal Success */}
                <Modal
                    visible={successModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSuccessModal(!successModal)}
                >
                    <View className="flex-1 items-center justify-center bg-black/50">
                    <View className="w-11/12 bg-white rounded-md shadow-md p-6">

                        <View className="my-2">
                            <Ionicons className='mx-auto' name='checkmark-circle' color="#3b82f6" size={100} />
                            <Text className='font-bold text-center text-xl'>Berhasil melakukan pembayaran!</Text>
                        </View>

                        <View className="flex-row w-full pt-2">
                            <Pressable
                                onPress={() => setSuccessModal(!successModal)}
                                className="bg-blue-500 py-2 px-4 w-full rounded-md"
                            >
                                <Text className="text-white text-base text-center font-bold">Tutup</Text>
                            </Pressable>
                        </View>
                    </View>
                    </View>
                </Modal>
                {/* End Of Modal Success */}
            </View>
            {keranjang.length ? (
                <View className='w-full absolute bottom-10'>
                    <View className='flex-row items-center bg-white mx-7 p-5 rounded-md shadow-md'>
                        <Text>Total: Rp. {totalHarga.toLocaleString()}</Text>
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            className='ml-auto bg-blue-500 px-5 py-3 rounded-md flex-row gap-2 items-center'
                            onPress={() => setModalPayment(true)}
                        >
                            <Ionicons name='cash-outline' color="#fff" size={20} />
                            <Text className='text-white font-bold'>Bayar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
            
        </>
    )
}

export default index