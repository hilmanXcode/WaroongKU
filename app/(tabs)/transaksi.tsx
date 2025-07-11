import { images } from '@/constants/images'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'

const transaksi = () => {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    return (
        <View className='flex-1 px-5'>
            <View className="flex justify-center items-center mt-14">
                <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
                <Text className="text-xl font-bold text-blue-500 italic -mt-3">WaroongKU</Text>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                className='flex-row bg-blue-500 justify-center items-center gap-2 py-5 rounded-md mt-5'
                onPress={() => setOpen(!open)}
            >
                <Ionicons color="#fff" name='time' size={25} />
                <Text className='text-white font-bold text-xl'>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
                modal
                mode='date'
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    )
}

export default transaksi