import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Props {
    id: string
    nama_barang: string
    harga: number
    isCashier?: boolean
    handleIncrement?: () => void
    handleDecrement?: () => void
    handleDelete?: () => void
}

const CardBarang = ({ id, nama_barang, harga, isCashier = false, handleIncrement, handleDecrement, handleDelete }: Props) => {
    if(isCashier){
        return (
            <View
                className='w-full bg-white mb-3 p-3 rounded-md' 
            >
            <View className='flex-row justify-center items-center gap-4'>
                <View className='bg-blue-500 p-5 rounded-md'>
                    <Ionicons name='logo-dropbox' size={20} color="#fff"/>
                </View>
                <View>
                    <Text className='font-bold'>{nama_barang}</Text>
                    <Text className=''>Rp. {harga.toLocaleString()}</Text>
                </View>
                <View className='flex-row justify-center items-center ml-auto gap-2'>
                    <TouchableOpacity
                        className='bg-blue-500 p-3 rounded-md flex flex-row gap-2 items-center'
                        activeOpacity={0.8}
                        onPress={handleIncrement}
                    >
                        <Ionicons name='cart' color="#fff" size={20} />
                        <Text className='font-bold text-white'>Tambahkan</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
        </View>
            
        )
    }
    else {
        return (
            <View
                className='w-full bg-white mb-4 p-3 rounded-md' 
            >
                <View className='flex-row justify-center items-center gap-4'>
                    <View className='bg-blue-500 p-5 rounded-md'>
                        <Ionicons name='logo-dropbox' size={20} color="#fff"/>
                    </View>
                    <View>
                        <Text className='font-bold'>{nama_barang}</Text>
                        <Text className=''>Rp. {harga.toLocaleString()}</Text>
                    </View>
                    <View className='flex-row justify-center items-center ml-auto gap-2'>
                        <TouchableOpacity
                            className='bg-blue-500 p-2 rounded-md'
                            activeOpacity={0.8}
                            onPress={() => router.push(`/barang/${id}`)}
                        >
                            <Ionicons name='pencil' color="#fff" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='bg-red-500 p-2 rounded-md'
                            activeOpacity={0.8}
                            onPress={handleDelete}
                        >
                            <Ionicons name='trash' color="#fff" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    
    
}

export default CardBarang