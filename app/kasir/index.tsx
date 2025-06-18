import { images } from '@/constants/images'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const index = () => {
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
            <View className='flex-row border rounded-md p-5 w-full'>
                <View>
                    <Text className='font-bold'>Indomie Goreng</Text>
                    <Text className='mt-1'>Rp. 5000</Text>
                </View>
                <View className='flex-row items-end ml-auto gap-2'>
                    <View className='px-5 bg-blue-500 py-2.5 rounded-md'>
                        <Text className='font-bold text-white'>+</Text>
                    </View>
                    <View className='px-5 bg-gray-500 py-2.5 rounded-md'>
                        <Text className='font-bold text-white'>0</Text>
                    </View>
                    <View className='px-5 bg-blue-500 py-2.5 rounded-md'>
                        <Text className='font-bold text-white'>-</Text>
                    </View>
                </View>
            </View>
            {/* End of Card */}
            <View className='flex-row border rounded-md p-5 w-full'>
                <View>
                    <Text className='font-bold'>Indomie Goreng</Text>
                    <Text className='mt-1'>Rp. 5000</Text>
                </View>
                <View className='flex-row items-end ml-auto gap-2'>
                    <View className='px-5 bg-blue-500 py-2.5 rounded-md'>
                        <Text className='font-bold text-white'>+</Text>
                    </View>
                    <View className='px-5 bg-gray-500 py-2.5 rounded-md'>
                        <Text className='font-bold text-white'>0</Text>
                    </View>
                    <View className='px-5 bg-blue-500 py-2.5 rounded-md'>
                        <Text className='font-bold text-white'>-</Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
  )
}

export default index