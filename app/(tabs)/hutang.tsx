import SearchBar from '@/components/SearchBar'
import { images } from '@/constants/images'
import { useDatabase } from '@/context/database-context'
import { useHutang, useSetHutang } from '@/context/hutang-context'
import { fetchAllHutang } from '@/database/hutang'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import 'react-native-get-random-values'

interface hutang {
    id: number
    detail_hutang: string
    nama_pembeli: string
    total_bayar: number
    tanggal: string
    waktu: string
}

const CardHutang = ({id, nama_pembeli, tanggal}: hutang) => {
    
    return (
        <TouchableOpacity
            className='w-full bg-white mb-4 p-3 rounded-md' 
            activeOpacity={0.6}
            onPress={() => router.push({ pathname: "/hutang/[id]", params: { id: id.toString() } })}
        >
            <View className='flex-row justify-between items-center gap-2'>
                <View className='flex-row items-center gap-3'>
                    <View className='bg-blue-500 p-5 rounded-md'>
                        <Ionicons name='person' size={20} color="#fff"/>
                    </View>
                    <View>
                        <Text className='font-semibold'>Nama Pembeli</Text>
                        <Text className=''>{nama_pembeli}</Text>
                    </View>
                </View>
                <View>
                    <View className='flex-row justify-center items-center ml-auto gap-2'>
                        <Ionicons name='calendar' color="#3b82f6" size={20} />
                        <Text className='font-medium '>{tanggal}</Text>
                    </View>
                    <View className='bg-green-500 p-1 rounded-md mt-2'>
                        <Text className='text-center font-bold text-white'>Lunas</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

}



const hutang = () => {
    const hutang = useHutang();
    const setHutang = useSetHutang();
    const [search, setSearch] = useState('');
    const [searchedHutang, setSearchedHutang] = useState<hutang[]>([])
    const database = useDatabase();

    useEffect(() => {
        const initData = async() => {
            const data = await fetchAllHutang(database);
            setHutang(data)
        }

        if(database)
            initData();

    }, [])

    useEffect(() => {
        if(search.trim()){
            const data = hutang.filter((item) => item.nama_pembeli.toLowerCase().startsWith(search.toLowerCase()))
            if(data.length){
                setSearchedHutang(data)
            }

        }
        else {
            setSearchedHutang([])
        }
    }, [search])

    

    return (
        <View className='flex-1 px-5'>
            <View className="flex justify-center items-center mt-14">
                <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
                <Text className="text-xl font-bold text-blue-500 italic -mt-3">WaroongKU</Text>
            </View>
            {/* Search Code */}
            <SearchBar title='Masukkan nama pembeli' barcodeBtn={false} value={search} onChangeText={(text: string) => setSearch(text)} />

            <FlashList
                data={search ? searchedHutang : hutang}
                renderItem={({item}) => (
                    <CardHutang {...item} />
                )}
                estimatedItemSize={91}
                className="mt-5 w-full"
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <Text>Data Tidak Ditemukan/Kosong</Text>
                )}
            />
        </View>
    )
}

export default hutang