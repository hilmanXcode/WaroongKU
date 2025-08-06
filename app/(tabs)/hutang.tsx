import SearchBar from '@/components/SearchBar'
import { images } from '@/constants/images'
import { useDatabase } from '@/context/database-context'
import { useHutang, useSetHutang } from '@/context/hutang-context'
import { fetchAllHutang } from '@/database/hutang'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
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
            <View className='flex-row justify-center items-center gap-2'>
                <View className='bg-blue-500 p-5 rounded-md'>
                    <Ionicons name='person' size={20} color="#fff"/>
                </View>
                <View>
                    <Text className='font-semibold'>Nama Pembeli</Text>
                    <Text className=''>{nama_pembeli}</Text>
                </View>
                <View className='flex-row justify-center items-center ml-auto gap-2'>
                    <Ionicons name='calendar' color="#3b82f6" size={20} />
                    <Text className='font-medium '>{tanggal}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}



const hutang = () => {
    const hutang = useHutang();
    const setHutang = useSetHutang();
    const [search, setSearch] = useState('');
    const database = useDatabase();

    useEffect(() => {
        const initData = async() => {
            const data = await fetchAllHutang(database);
            setHutang(data)
        }

        if(database)
            initData();

    }, [])

    return (
        <View className='flex-1 px-5'>
            <View className="flex justify-center items-center mt-14">
                <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
                <Text className="text-xl font-bold text-blue-500 italic -mt-3">WaroongKU</Text>
            </View>
            {/* Search Code */}
            <SearchBar value={search} onChangeText={(text: string) => setSearch(text)} />

                <FlatList
                data={hutang}
                renderItem={({item}) => (
                    <CardHutang {...item} />
                )}
                
                className="mt-5 w-full"
                keyExtractor={(item) => item.id.toString()}
                
            />
        </View>
    )
}

export default hutang