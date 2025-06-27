import CardBarang from "@/components/CardBarang";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import { useBarang, useSetBarang } from "@/context/barang-context";
import { useKeranjang, useSetKeranjang } from "@/context/keranjang-context";
import getDatabase from "@/database/sqlite";
import { router } from "expo-router";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';


export default function Index() {

  const fakeData = [
    {
      "id": "asdasdasd",
      "nama_barang": "Indomie Goreng",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "xasx",
      "nama_barang": "Bakwan Geming",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "pqwoe",
      "nama_barang": "Cuanki",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "slebewgimang",
      "nama_barang": "Cakwe",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "qpaldqw",
      "nama_barang": "Sepatu Geming",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "mxjasdjq",
      "nama_barang": "Laptop Bekas",
      "barcode": "123121231233331222",
      "harga": 1000
    }
  ];

  const [database, setDatabase] = useState<SQLiteDatabase | null>(null)
  const [query, setQuery] = useState('');
  const [searchedBarang, setSearchedBarang] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const keranjang = useKeranjang();
  const setKeranjang = useSetKeranjang();
  const barang = useBarang();
  const setBarang = useSetBarang();
  
  
  const handleIncrement = useCallback((id: string, nama_barang: string, harga: number) => {

      if(keranjang.find((item) => item.id === id)){
        setKeranjang(prevKeranjang => {
          return prevKeranjang.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item)    
        });
      }
      else {
        setKeranjang((keranjang) => [
            ...keranjang,
            {id: id, nama_barang: nama_barang, harga: harga, quantity: 1}
        ])
      }
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Berhasil menambahkan ke keranjang',
        position: 'bottom',
        swipeable: false,
        bottomOffset: 80,
        visibilityTime: 900
      });
    }, [keranjang, setKeranjang])
  

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
      const initDb = async() => {
        try {
          const database = await getDatabase();
          setDatabase(database);

        } catch (error) {
          console.log(error)
          throw error;
        } finally {
          await database?.execAsync(`
            CREATE TABLE IF NOT EXISTS barang (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nama_barang varchar(255) NOT NULL,
              barcode varchar(255) NOT NULL,
              harga int(11) NOT NULL
            );
          `)
        }
      }

      setBarang(fakeData);

      initDb();
    }, [])


    const onPressBarcode = async() => {
      router.push("/scanner")
    }

  return (
    <View
     className="flex-1"
    >
      <View className="flex justify-center items-center mt-14">
        <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
        <Text className="text-xl font-bold text-blue-500 italic -mt-3">WarungKu</Text>
      </View>
      <View className="px-5">
        <SearchBar value={query} onChangeText={(text: string) => setQuery(text)} onPressBarcode={onPressBarcode} />
        
      </View>
 
      <ScrollView className="flex px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
            paddingBottom: 10
        }}>


      <FlatList
          data={query.length ? searchedBarang : barang}
          renderItem={({item}) => (
            
            <CardBarang {...item} isCashier={true} value={0} handleIncrement={() => handleIncrement(item.id, item.nama_barang, item.harga)} />     
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
        
      {keranjang.length ? (
        <TouchableOpacity onPress={() => router.push("/keranjang")} activeOpacity={0.8} className="flex-1 bg-blue-500 p-5 rounded-md">
          <Text className="font-bold text-white text-center">
            Cek Keranjang 
          </Text>
        </TouchableOpacity>
      ): null}
      
        
      </ScrollView>
    </View>
  );
}
