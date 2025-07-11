import CardBarang from '@/components/CardBarang';
import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { useBarang, useSetBarang } from '@/context/barang-context';
import { useBarcode, useSetBarcode } from '@/context/barcode-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface modalProps {
  modalValue: boolean
  setModalValue: (status: boolean) => void;
}

const AddModal = ({ modalValue, setModalValue }: modalProps) => {
  const barcode = useBarcode();
  const setBarcode = useSetBarcode();


  return (
    <Modal
      visible={modalValue}
      transparent
      animationType="fade"
      onRequestClose={() => setModalValue(!modalValue)}
  >
      <View className="flex-1 items-center justify-center bg-black/50">
      <View className="w-11/12 bg-white rounded-md shadow-md p-6">
          <View className="flex-row items-center justify-between pb-4">
            <View className='flex-row items-center gap-2'>
              <Ionicons name='add-circle-outline' size={25} color="#000" className='font-bold' />
              <Text className="text-xl font-bold">
                Tambah Barang
              </Text>
            </View>
            
          <Pressable onPress={() => setModalValue(!modalValue)}>
              <Text className="text-gray-400 text-lg">✖</Text>
          </Pressable>
          </View>

          <View className="my-2">
              <View>
                  <Text className="text-base font-medium">
                      Nama Barang <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                      // value={cashPayment.toString()}
                      // onChangeText={(number: string) => setCashPayment(Number(number))}
                      className="w-full px-3 py-2 border border-gray-300 rounded mt-1 text-black"
                  />
              </View>
              <View className='mt-2'>
                  <Text className="text-base font-medium">
                      Barcode
                  </Text>
                  <View className='flex-row items-center'>
                    <TextInput
                        // value={barcode.toString()}
                        // onChangeText={(number: string) => setCashPayment(Number(number))}
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1 text-black"
                        />
                      <TouchableOpacity onPress={() => router.push({
                        pathname: "/scanner",
                        params: {
                          tambahBarang: "yes"
                        }
                      })} activeOpacity={0.8} className='absolute right-3 my-auto'>
                        <Image source={images.barcode} className='size-7' />
                      </TouchableOpacity>
                  </View>
              </View>
              <View className='mt-2'>
                  <Text className="text-base font-medium">
                      Harga <Text className="text-red-600">*</Text>
                  </Text>
                  <TextInput
                      keyboardType='numeric'
                      // value={cashPayment.toString()}
                      // onChangeText={(number: string) => setCashPayment(Number(number))}
                      className="w-full px-3 py-2 border border-gray-300 rounded mt-1 text-black"
                      />
                  
              </View>
          </View>

          <View className="flex-row w-full pt-2">
              <Pressable
                  onPress={() => console.log("HELO DUNIA")}
                  className="bg-blue-500 py-4 w-full rounded-md flex-row gap-2 items-center justify-center"
              >
                  <Ionicons name='cash' color="#fff" size={20} />
                  <Text className="text-white text-base text-center font-bold">Tambah Barang</Text>
              </Pressable>
          </View>
      </View>
      </View>
  </Modal>
  )
}

const Barang = () => {
  const [query, setQuery] = useState("");
  const barang = useBarang();

  const [addModal, setAddModal] = useState(false);
  const setBarang = useSetBarang();

  return (
    <View
      className="flex-1"
    >
      <View className="flex justify-center items-center mt-14">
        <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
        <Text className="text-xl font-bold text-blue-500 italic -mt-3">WaroongKU</Text>
      </View>

      <View className="px-5">
        <SearchBar value={query} onChangeText={(text: string) => setQuery(text)} onPressBarcode={() => console.log("HALO GAN")} />
        <TouchableOpacity onPress={() => setAddModal(!addModal)} activeOpacity={0.8} className='w-full bg-blue-500 rounded-md mt-5 p-4 flex-row items-center justify-center gap-2'>
          <Ionicons name='add-circle' size={25} color="#fff" />
          <Text className='text-white font-bold text-xl'>Tambah Barang</Text>
        </TouchableOpacity>
      </View>

      <AddModal modalValue={addModal} setModalValue={setAddModal} />

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