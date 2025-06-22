import { images } from '@/constants/images'
import { useKeranjangContext } from '@/context/keranjang-context'
import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const index = () => {

    const { keranjang, setKeranjang } = useKeranjangContext();

    const totalHarga = useMemo(() => {
        return keranjang.reduce((sum, item) => sum + item.quantity * item.harga, 0);
    }, [keranjang]);

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

    const debugKeranjang = () => {
        setKeranjang((keranjang) => [
            ...keranjang,
            {id: "xyz", nama_barang: "Bakwan", harga: 1000, quantity: 1}
        ])
        setKeranjang((keranjang) => [
            ...keranjang,
            {id: "asdasd", nama_barang: "KIMCI", harga: 5000, quantity: 1}
        ])
    }


    return (
        <View className='flex'>
            <View className='flex-row justify-between items-center px-5 mt-14'>
                <TouchableOpacity onPress={router.back}>
                    <Image source={images.arrowleft} className='size-5'/>
                </TouchableOpacity>
                <Text className='font-bold text-xl mx-auto'>Keranjang</Text>
                <TouchableOpacity>
                    <Image source={images.barcode} className='size-5'/>
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
                
                {/* End of Card */}
                {/* <FlatList
                    data={keranjang}
                    renderItem={({item}) => (
                        <CardBarang {...item} isCashier={true} value={keranjang.find((i) => item.id == i.id)?.quantity} handleIncrement={() => handleIncrement(item.id, item.nama_barang, item.harga)} handleDecrement={() => handleDecrement(item.id)} />     
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        gap: 20,
                        // marginHorizontal: "auto",
                        paddingRight: 5,
                        marginBottom: 10
                    }}
                    className="mt-5 w-full"
                    ListEmptyComponent={(
                        <View className="mb-5">
                        <Text>Oppsie, data barang kosong, silahkan tambahkan barang terlebih dahulu.</Text>
                        </View>
                    )}
                    scrollEnabled={false}
                /> */}
            </View>
        </View>
    )
}

export default index