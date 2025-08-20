import { images } from '@/constants/images';
import { useBarang, useSetBarang } from '@/context/barang-context';
import { useBarcode, useSetBarcode } from '@/context/barcode-context';
import { useDatabase } from '@/context/database-context';
import { editBarang, fetchAllBarang } from '@/database/barang';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditBarang = () => {
  const barang = useBarang();
  const setBarang = useSetBarang();
  const barcode = useBarcode();
  const setBarcode = useSetBarcode();
  const { id } = useLocalSearchParams();
  const database = useDatabase();
  const data = barang.find((item) => item.id === id);

  if(!data)
    return router.back();
  
  const [namaBarang, setNamaBarang] = useState(data.nama_barang);
  const [harga, setHarga] = useState(data.harga);
  const [editBarcode, setEditBarcode] = useState(data.barcode);
  
  useEffect(() => {
    if(barcode){
      setEditBarcode(barcode)
    }
  }, [barcode])


  const handleSubmit = async() => {
    if(!id || !namaBarang || !harga)
      return Alert.alert("Error", "Form yang memiliki * wajib di isi!")
    
    try {
      const updated = await editBarang({database, id_barang: id, nama_barang: namaBarang, barcode: editBarcode, harga: harga})
      
      if(!updated)
        return Alert.alert("Gagal mengupdate data barang");

      const results = await fetchAllBarang({database});
      if(results){
        setBarang(results)
      } else {
        Alert.alert("Gagal mengupdate data barang!");
      }
    } catch(err){
      console.error(err)
    }
    setBarcode('');
    router.back();
  }

  

  return (
    <View className='flex'>
        <View className='flex-row justify-between items-center px-5 mt-14'>
            <TouchableOpacity onPress={router.back}>
                <Image source={images.arrowleft} className='size-7'/>
            </TouchableOpacity>
            <Text className='font-bold text-xl mx-auto'>Edit Barang</Text>
        </View>

        <View className='flex flex-row items-center -mt-24 px-10 h-screen'>
          <View className='bg-white p-5 rounded-md'>
            <View className='flex py-2 flex-row items-center gap-2 mb-2'>
              <View className='bg-blue-500 p-2 rounded-md'>
                <Ionicons name='pencil' size={22} color="#fff" />
              </View>
              <View className='flex'>
                <Text className='text-xl text-wrap font-bold'>Edit Data Barang</Text>
                <Text className='text-base w-32 line-clamp-1'>{data.nama_barang}</Text>
              </View>
            </View>
            <View>
                <Text className="text-base font-medium">
                    Nama Barang <Text className="text-red-600">*</Text>
                </Text>
                <TextInput
                    

                    value={namaBarang}
                    onChangeText={(value: string) => setNamaBarang(value)}
                    className="px-3 py-2 border border-slate-500 rounded mt-1 text-black"
                />
            </View>
            <View className='mt-2'>
                  <Text className="text-base font-medium">
                      Barcode
                  </Text>
                  <View className='flex-row items-center'>
                    <TextInput
                        value={editBarcode}
                        onChangeText={(value: string) => setEditBarcode(value)}
                        className="w-full px-3 py-2 border border-slate-500 rounded mt-1 text-black"

                        />
                      <TouchableOpacity onPress={() => router.push({
                        pathname: "/scanner",
                        params: {
                          tambahBarang: "yes"
                        }
                      })} activeOpacity={0.8} className='absolute right-2 bottom-1.5'>
                        <Image source={images.barcode} className='size-7' tintColor="#64748b" />
                      </TouchableOpacity>
                  </View>
              </View>
              <View className='mt-2'>
                <Text className="text-base font-medium">
                    Harga <Text className="text-red-600">*</Text>
                </Text>
                <TextInput
                    value={harga.toString()}
                    keyboardType='numeric'
                    onChangeText={(value: string) => setHarga(Number(value))}
                    className="w-full px-3 py-2 border border-slate-500 rounded mt-1 text-black"
                />
            </View>
            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} className='flex flex-row gap-2 items-center justify-center px-5 py-4 bg-blue-500 mt-5 rounded-md'>
                <Ionicons name='pencil' size={20} color="#fff" />
                <Text className='text-white font-bold text-xl'>Edit Barang</Text>
            </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

export default EditBarang