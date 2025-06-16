import { images } from '@/constants/images'
import React from 'react'
import { Image, TextInput, View } from 'react-native'

const SearchBar = () => {
  return (
    <View className='flex-row items-center border border-[#222831] rounded-md px-5 py-1 mt-5'>
        <Image source={images.search} className='size-5' tintColor="black"/>
        <TextInput
            placeholder='Masukkan nama barang'
            className='flex-1 ml-1 text-[#222831]'
            placeholderTextColor="#222831"
        />
        <Image source={images.barcode} className='size-5' tintColor="#222831"/>
    </View>
  )
}

export default SearchBar