import { images } from '@/constants/images';
import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  value: string
  onChangeText?: (text: string) => void;
  onPressBarcode?: () => void;
}

const SearchBar = ({value, onChangeText, onPressBarcode}: Props) => {
  return (
    <View className='flex-row items-center border border-[#222831] rounded-md px-5 py-1 mt-5'>
        <Image source={images.search} className='size-5' tintColor="black"/>
        <TextInput
            placeholder='Masukkan nama barang'
            className='flex-1 ml-1 text-[#222831]'
            placeholderTextColor="#222831"
            onChangeText={onChangeText}
            value={value}
        />
        <TouchableOpacity onPress={onPressBarcode}>
          <Image source={images.barcode} className='size-5' tintColor="#222831"/>
        </TouchableOpacity>
    </View>
  )
}

export default SearchBar