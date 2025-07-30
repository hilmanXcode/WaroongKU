import { images } from '@/constants/images';
import { useBarang, useSetBarang } from '@/context/barang-context';
import { useBarcode, useSetBarcode } from '@/context/barcode-context';
import { editBarang, fetchAllBarang } from '@/database/barang';
import getDatabase from '@/database/sqlite';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EditBarang = () => {
  const barang = useBarang();
  const setBarang = useSetBarang();
  const barcode = useBarcode();
  const setBarcode = useSetBarcode();
  const { id } = useLocalSearchParams();
  const [database, setDatabase] = useState<SQLiteDatabase | null>(null)
  const data = barang.find((item) => item.id === id);

  if(!data)
    return router.back();
  
  const [namaBarang, setNamaBarang] = useState(data.nama_barang);
  const [harga, setHarga] = useState(data.harga);
  const [editBarcode, setEditBarcode] = useState(data.barcode);
  
  useEffect(() => {
    const initDb = async() => {
      try {
        const database = await getDatabase();
        setDatabase(database)
      } catch (err){
        console.error(err)
        throw new Error("Gagal mendapatkan koneksi ke database");
      }
    }

    initDb();
  }, [])

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

        <View className='flex flex-row items-center px-10 h-screen -mt-16'>
          <View>
            <Text className='text-2xl font-bold mb-2'>Edit Data Barang {data.nama_barang}</Text>
            <View>
                <Text className="text-base font-medium">
                    Nama Barang <Text className="text-red-600">*</Text>
                </Text>
                <TextInput
                    value={namaBarang}
                    onChangeText={(value: string) => setNamaBarang(value)}
                    className="w-full px-3 py-2 border border-slate-500 rounded mt-1 text-black"
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