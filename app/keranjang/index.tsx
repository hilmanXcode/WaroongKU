import { images } from '@/constants/images'
import { useKeranjangContext } from '@/context/keranjang-context'
import { Link, router } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const index = () => {

    const { keranjang, setKeranjang } = useKeranjangContext();

    // const totalHarga = useMemo(() => {
    //     return keranjang.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    // }, [keranjang]);

    const handleIncrement = (id: string, nama_barang: string, harga: number) => {
        
        if(keranjang.find((item) => item.id === id)){
        setKeranjang(prevKeranjang => {
            const updatedKeranjang = [...prevKeranjang];
            updatedKeranjang.find((item) => {
            if(item.id == id){
                item.quantity += 1;
            }
            });

            return updatedKeranjang;
        });
        }
        else {
            setKeranjang((keranjang) => [
                ...keranjang,
                {id: id, nama_barang: nama_barang, harga: harga, quantity: 1}
            ])
        }

    }

    const handleDecrement = (id: string) => {
        setKeranjang(prev =>
        prev.map(item => {
            if (item.id === id) {
            if (item.quantity <= 1) return null;
            return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        }).filter(item => item !== null)
        );
    };



    return (
        <View className='flex'>
            <View className='flex-row justify-between items-center px-5 mt-14'>
                <TouchableOpacity>
                    <Link href={"/"}>
                        <Image source={images.arrowleft} className='size-7'/>
                    </Link>
                </TouchableOpacity>
                <Text className='font-bold text-xl mx-auto'>Keranjang</Text>
                <TouchableOpacity onPress={() => router.push("/scanner")}>
                    <Image source={images.barcode} className='size-7'/>
                </TouchableOpacity>

            </View>
            <View className='flex-col gap-4 items-center px-5 mt-10'>
                {/* Card */}
                {keranjang.length ? keranjang.map((item) => {
                    return (
                        <View key={item.id} className='flex-row border rounded-md p-5 w-full'>
                            <View>
                                <Text className='font-bold'>{item.nama_barang}</Text>
                                <Text className='mt-1'>Rp. {item.harga.toLocaleString()}</Text>
                            </View>
                            <View className='flex-row items-end ml-auto gap-2'>
                                <TouchableOpacity onPress={() => handleDecrement(item.id)} activeOpacity={0.8} className='px-5 bg-blue-500 py-2.5 rounded-md'>
                                    <Text className='font-bold text-white'>-</Text>
                                </TouchableOpacity>
                                <View className='px-5 bg-gray-500 py-2.5 rounded-md'>
                                    <Text className='font-bold text-white'>{item.quantity}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleIncrement(item.id, item.nama_barang, item.harga)} activeOpacity={0.8} className='px-5 bg-blue-500 py-2.5 rounded-md'>
                                    <Text className='font-bold text-white'>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
                :
                (
                    <View className='flex justify-center items-center'>
                        <View>
                            <Text>Opps, keranjangmu kosong nih, cari/scan barang untuk menambahkan ke keranjang.</Text>
                        </View>
                    </View>
                ) }
                
            </View>
        </View>
    )
}

export default index