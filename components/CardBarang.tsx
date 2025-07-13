import { Ionicons } from '@expo/vector-icons'
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
    // handleIncrement?: () => void
}

const CardBarang = ({ id, nama_barang, harga, isCashier = false, value = 0, handleIncrement, handleDecrement }: Props) => {
    if(isCashier){
        if(value === 0){
            return (
                <View className='bg-white px-3 py-4 h-[95%] w-[47.9%] rounded-md drop-shadow-xl'>
                    <Text className='font-semibold'>{nama_barang}</Text>
                    <Text className='mt-2'>Rp. {harga}</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleIncrement} className={`flex-row w-full justify-center gap-2 items-center mt-3 bg-blue-500  rounded-md transition-all py-2 `}>
                        <Ionicons name='cart' color="#fff" size={20} />
                        <Text className='text-white font-medium text-base'>Tambahkan</Text>
                    </TouchableOpacity>
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
        <View className='bg-white px-3 py-4 h-[95%] w-[48%] rounded-md'>
            <Text className='font-semibold'>{nama_barang}</Text>
            <Text className='mt-2'>Rp. {harga}</Text>
            <View className='flex-row mt-2 justify-center gap-2'>
                <TouchableOpacity className='p-2 bg-blue-500 rounded-md flex-row items-center gap-2'>
                    <Ionicons name='pencil' color="#fff" size={20}></Ionicons>
                    <Text className='text-white'>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity className='p-2 bg-red-500 rounded-md flex-row items-center gap-2'>
                    <Ionicons name='trash' color="#fff" size={20}></Ionicons>
                    <Text className='text-white'>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
    }

    
    
}

export default CardBarang