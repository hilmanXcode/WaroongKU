import CardBarang from '@/components/CardBarang';
import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { useBarang, useSetBarang } from '@/context/barang-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const Barang = () => {
  const [query, setQuery] = useState("");
  const barang = useBarang();
  const setBarang = useSetBarang();

  return (
    <View
      className="flex-1"
    >
      <View className="flex justify-center items-center mt-14">
        <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
        <Text className="text-xl font-bold text-blue-500 italic -mt-3">WarungKu</Text>
      </View>

      <View className="px-5">
        <SearchBar value={query} onChangeText={(text: string) => setQuery(text)} onPressBarcode={() => console.log("HALO GAN")} />
        <TouchableOpacity activeOpacity={0.8} className='w-full bg-blue-500 rounded-md mt-5 p-4 flex-row items-center justify-center gap-2'>
          <Ionicons name='add-circle' size={25} color="#fff" />
          <Text className='text-white font-bold text-xl'>Tambah Barang</Text>
        </TouchableOpacity>
      </View>

      <View className='px-5'>

      <FlatList
          data={barang}
          renderItem={({item}) => (
            
            <CardBarang {...item} isCashier={false} handleIncrement={() => console.log("HALO GAN")} />     
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            // marginHorizontal: "auto",
            paddingRight: 5,
            marginBottom: 10
          }}
          className="mt-5 w-full"
          ListEmptyComponent={(
            
            <View>
              <Text>Barang Kosong Bos</Text>
            </View>
          )}
          scrollEnabled={false}
          />
      </View>
    </View>
    
  )
}

export default Barang