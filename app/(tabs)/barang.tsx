import CardBarang from '@/components/CardBarang';
import SearchBar from '@/components/SearchBar';
import { images } from '@/constants/images';
import { useBarang, useSetBarang } from '@/context/barang-context';
import { useBarcode, useSetBarcode } from '@/context/barcode-context';
import { useDatabase } from '@/context/database-context';
import { addNewBarang, fetchAllBarang, hapusBarang } from '@/database/barang';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SQLiteDatabase } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface modalProps {
  modalValue: boolean
  setModalValue: (status: boolean) => void;
  database: SQLiteDatabase | null;
  setSuccess: (status: boolean) => void
  targetId?: string
  setDeleteId?: (text: string) => void;
}
interface barang {
  id: string
  nama_barang: string
  barcode: string
  harga: number
}

const AddModal = ({ modalValue, setModalValue, database, setSuccess }: modalProps) => {
  const barcode = useBarcode();
  const setBarcode = useSetBarcode();
  const [harga, setHarga] = useState(0);
  const [namaBarang, setNamaBarang] = useState('');

  const handleSubmit = async () => {

    if(!harga || !namaBarang)
      return Alert.alert("Error", "Tolong isi form yang memiliki tanda *")

    try {
      await addNewBarang({database, nama_barang: namaBarang, barcode, harga})
      setSuccess(true);
      setModalValue(false);
      setBarcode('');
      setNamaBarang('')
      setHarga(0);
    } catch(err){
      setSuccess(false);
      console.error(err);
      throw Error("Gagal menambahkan barang baru");
    }
    
  }


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
                        value={barcode}
                        onChangeText={(value: string) => setBarcode(value)}
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
                      keyboardType='numeric'
                      value={harga.toString()}
                      onChangeText={(number: string) => setHarga(Number(number))}
                      className="w-full px-3 py-2 border border-slate-500 rounded mt-1 text-black"
                      />
                  
              </View>
          </View>

          <View className="flex-row w-full pt-2">
              <TouchableOpacity
                  onPress={handleSubmit}
                  className="bg-blue-500 py-4 w-full rounded-md flex-row gap-2 items-center justify-center"
                  activeOpacity={0.8}
              >
                  <Ionicons name='logo-dropbox' color="#fff" size={20} />
                  <Text className="text-white text-base text-center font-bold">Tambah Barang</Text>
              </TouchableOpacity>
          </View>
      </View>
      </View>
  </Modal>
  )
}

const DeleteModal = ({ modalValue, setModalValue, database, setSuccess, targetId, setDeleteId }: modalProps) => {
  if(!setDeleteId){
    Alert.alert("Fungsi deleteId tidak ditemukan");
    return;
  }
  const barang = useBarang();

  useEffect(() => {
    if (modalValue && !barang.find((item) => item.id === targetId)) {
      Alert.alert("Barang tidak ditemukan di database");
      setModalValue(false);
    }
  }, [])

  useEffect(() => {
    if (modalValue && !targetId) {
      Alert.alert("Something went wrong, contact developers!");
      setModalValue(false);
    } 
  }, [targetId]);
  

  const namaBarang = barang.find((item) => item.id === targetId)?.nama_barang;

  const handleSubmit = async() => {
    try {
      const deleted = await hapusBarang({ database, id_barang: targetId });
      
      if(!deleted)
        return Alert.alert("Gagal menghapus barang");
      
      setSuccess(true);
      setModalValue(false);
      setDeleteId('')
    } catch(err){
      setSuccess(false);
      console.error(err);
      throw Error("Gagal menambahkan barang baru");
    }


    
  }


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
              <Ionicons name='trash' size={25} color="#000" className='font-bold' />
              <Text className="text-xl font-bold">
                Hapus Barang
              </Text>
            </View>
            
          <Pressable onPress={() => setModalValue(!modalValue)}>
              <Text className="text-gray-400 text-lg">✖</Text>
          </Pressable>
          </View>

          <View className="my-2">
              <Text className='font-bold text-2xl text-center'>Apakah kamu yakin ingin menghapus barang {namaBarang}?</Text>
          </View>

          <View className="flex-row w-full pt-2">
              <TouchableOpacity
                  onPress={handleSubmit}
                  className="bg-red-500 py-4 w-full rounded-md flex-row gap-2 items-center justify-center"
                  activeOpacity={0.8}
              >
                  <Text className="text-white text-base text-center font-bold">Yakin</Text>
              </TouchableOpacity>
          </View>
      </View>
      </View>
  </Modal>
  )
}

const Barang = () => {
  const database = useDatabase();
  const [query, setQuery] = useState("");
  const barang = useBarang();
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const setBarang = useSetBarang();
  const [deleteId, setDeleteId] = useState("");
  const [successAction, setSuccessAction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchedBarang, setSearchedBarang] = useState<barang[]>([]);
  const [found, setFound] = useState(false);


  useEffect(() => {
      if(query.trim()){
        if(barang.filter((item) => item.nama_barang.toLowerCase().startsWith(query.toLowerCase())).length === 0){
          setLoading(false)
        }
        else {
          setSearchedBarang(barang.filter((item) => item.nama_barang.toLowerCase().startsWith(query.toLowerCase())))
          setFound(true);
          setLoading(false);
        }

      }
      else {
        setFound(false)
        setSearchedBarang([]);

      }
        
    }, [query])

  
  useEffect(() => {
    const fetchBarang = async() => {
      try {
        const results = await fetchAllBarang({ database })
        if(results){
          setBarang(results)
          setSuccessAction(false);
        }
        else {
          Alert.alert("Gagal mengambil data barang");
        }
      } catch(err){
        console.error(err);
      }
    }

    if(successAction)
      fetchBarang();
      

  }, [successAction])

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModal(true);
  }

  return (
    <View
      className="flex-1"
    >
      <View className="flex justify-center items-center mt-14">
        <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
        <Text className="text-xl font-bold text-blue-500 italic -mt-3">WaroongKU</Text>
      </View>

      <View className="px-5">
        <SearchBar value={query} onChangeText={(text: string) => setQuery(text)} onPressBarcode={() => router.push({
          pathname: "/scanner",
          params: {
            editBarang: "yes"
          }
        })} />
        <TouchableOpacity onPress={() => setAddModal(!addModal)} activeOpacity={0.8} className='w-full bg-blue-500 rounded-md mt-5 p-4 flex-row items-center justify-center gap-2'>
          <Ionicons name='add-circle' size={25} color="#fff" />
          <Text className='text-white font-bold text-xl'>Tambah Barang</Text>
        </TouchableOpacity>
      </View>

      <AddModal modalValue={addModal} setModalValue={setAddModal} database={database} setSuccess={setSuccessAction} />
      <DeleteModal modalValue={deleteModal} setDeleteId={setDeleteId} setModalValue={setDeleteModal} database={database} targetId={deleteId} setSuccess={setSuccessAction} />

      <ScrollView className="flex px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
          paddingBottom: 10
      }}>

      <FlatList
          data={query.length ? searchedBarang : barang}
          renderItem={({item}) => (
            
            <CardBarang {...item} isCashier={false} handleDelete={() => handleDelete(item.id)} />     
          )}
          keyExtractor={(item) => item.id}
          className="mt-5 w-full"
          ListEmptyComponent={(
            
            <View className="mb-5">
                {loading ? (
                  <ActivityIndicator 
                  size="large"
                  color="#3b82f6"
                  className="mt-10 self-center"
                />
                ) : found ? null : (
                  <Text>Barang tidak ditemukan</Text>
                ) }
                
              </View>
          )}
          scrollEnabled={false}
          />
      </ScrollView>
    </View>
    
  )
}

export default Barang