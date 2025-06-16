import React from 'react'
import { Text, TextInput, View } from 'react-native'

interface Props {
    id: string
    nama: string
    barcode: string
    harga: number
}

const CardBarang = ({ id, nama, barcode, harga }: Props) => {
  return (
    <View className='bg-blue-500 px-3 py-4 h-[95%] w-[48%] rounded-md'>
        <Text className='text-white font-semibold'>{nama}</Text>
        <Text className='text-white mt-2'>Rp. {harga}</Text>
        <View className='flex-row w-full justify-evenly gap-2 items-center mt-3'>
            <View className='bg-white px-5 h-11 rounded-md -ml-0.5'>
                <View className='flex-1 items-center justify-center'>
                    <Text className='font-medium text-xl'>+</Text>
                </View>
            </View>
            <View className='bg-gray-500 px-5 rounded-md'>
                <TextInput
                    value="0"
                    className='text-white font-bold'
                />
            </View>
            <View className='bg-white px-5 h-11 rounded-md -ml-0.5'>
                <View className='flex-1 items-center justify-center'>
                    <Text className='font-medium text-xl'>-</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

export default CardBarang