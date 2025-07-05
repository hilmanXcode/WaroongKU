import { images } from '@/constants/images'
import { useKeranjang, useSetKeranjang } from '@/context/keranjang-context'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

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
                <View className='px-5 py-2.5 rounded-md'>
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

    const keranjang = useKeranjang();
    const setKeranjang = useSetKeranjang();

    const totalHarga = useMemo(() => {
        return keranjang.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    }, [keranjang]);

    const handleIncrement = useCallback((id: string, nama_barang: string, harga: number) => {
        if(keranjang.find((item) => item.id === id)){
        setKeranjang(prevKeranjang => {
            return prevKeranjang.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item)    
        });
        }
        else {
        setKeranjang((keranjang) => [
            ...keranjang,
            {id: id, nama_barang: nama_barang, harga: harga, quantity: 1}
        ])
        }
    }, [keranjang, setKeranjang])
  

    const handleDecrement = useCallback((id: string) => {
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
                            <CardKeranjang {...item} handleIncrement={() => handleIncrement(item.id, item.nama_barang, item.harga)} handleDecrement={() => handleDecrement(item.id)} />     
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
            </View>
            {keranjang.length ? (
                <View className='w-full absolute bottom-10'>
                    <View className='flex-row items-center bg-white mx-7 p-5 rounded-md shadow-md'>
                        <Text>Total: Rp. {totalHarga.toLocaleString()}</Text>
                        <TouchableOpacity activeOpacity={0.8} className='ml-auto bg-blue-500 px-5 py-3 rounded-md'>
                            <Text className='text-white font-bold'>Bayar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
            
        </>
    )
}

export default index