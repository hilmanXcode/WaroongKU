import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

interface Props {
    id: string
    nama_barang: string
    harga: number
    isCashier?: boolean
    value?: number
    handleIncrement?: () => void
    handleDecrement?: () => void
    handleDelete?: () => void
}

const CardBarang = ({ id, nama_barang, harga, isCashier = false, value = 0, handleIncrement, handleDecrement, handleDelete }: Props) => {
    if(isCashier){
        if(value === 0){
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
                <View className='bg-white px-3 py-4 h-[95%] w-[47.9%] rounded-md drop-shadow-xl'>
                    <Text className='font-semibold'>{nama_barang}</Text>
                    <Text className='mt-2'>Rp. {harga}</Text>
                    <View className='flex-row w-full justify-evenly gap-2 items-center mt-3'>
                        <TouchableOpacity className='bg-black/80 px-5 h-11 rounded-md -ml-0.5' onPress={handleDecrement}>
                            <View className='flex-1 items-center justify-center'>
                                <Text className='font-medium text-xl text-white'>-</Text>
                            </View>
                        </TouchableOpacity>
                        <View className='bg-blue-500 px-4 rounded-md'>
                            <TextInput
                                value={value.toString()}
                                keyboardType='numeric'
                                className='text-white font-bold'
                                editable={false}
                            />
                        </View>
                        <TouchableOpacity className='bg-black/80 px-5 h-11 rounded-md -ml-0.5' onPress={handleIncrement}>
                            <View className='flex-1 items-center justify-center'>
                                <Text className='font-medium text-xl text-white'>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        
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