import CardBarang from "@/components/CardBarang";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import getDatabase from "@/database/sqlite";
import { SQLiteDatabase } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  const fakeData = [
    {
      "id": "asdasdasd",
      "nama": "Indomie Goreng",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "xasx",
      "nama": "Bakwan Geming",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "pqwoe",
      "nama": "Cuanki",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "qpaldqw",
      "nama": "Sepatu Geming",
      "barcode": "123121231233331222",
      "harga": 1000
    },
    {
      "id": "mxjasdjq",
      "nama": "Laptop Bekas",
      "barcode": "123121231233331222",
      "harga": 1000
    }
  ];

  const [database, setDatabase] = useState<SQLiteDatabase | null>(null)
  const [keranjang, setKeranjang] = useState<keranjangProps[]>([])
  // const navigation = useNavigation();

  interface keranjangProps {
    id: string
    nama_barang: string
    harga: number
    quantity: number
  }

  
  useEffect(() =>{
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

      initDb();

    }

  }, []);

  const totalHarga = useMemo(() => {
    return keranjang.reduce((sum, item) => sum + item.quantity * item.harga, 0);
  }, [keranjang]);

  const handleIncrement = (id: string, nama_barang: string, harga: number) => {
    
    if(keranjang.find((item) => item.id === id)){
      setKeranjang(prevKeranjang => {
        const updatedKeranjang = [...prevKeranjang];
        updatedKeranjang.find((item) => {
          if(item.id == id){
            item.quantity += 1;
          }
        });

        return updatedKeranjang;
      });
    }
    else {
      setKeranjang((keranjang) => [
          ...keranjang,
          {id: id, nama_barang: nama_barang, harga: harga, quantity: 1}
      ])
    }
  
  }

  const handleDecrement = (id: string) => {
    setKeranjang(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (item.quantity <= 1) return null;
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }).filter(item => item !== null)
    );
  };

  return (
    <View
     className="flex-1"
    >
      <View className="flex justify-center items-center mt-14">
        <Image source={images.logo} className="size-12" tintColor="#3b82f6" />
        <Text className="text-xl font-bold text-blue-500 italic -mt-3">WarungKu</Text>
      </View>
      <View className="px-5">
        <SearchBar/>
        <TouchableOpacity onPress={() => setKeranjang([])} activeOpacity={0.8} className="mt-4 bg-blue-500 w-48 px-5 py-4 rounded-md flex flex-row gap-2 justify-center">
          <Text className="text-white font-bold">Reset Keranjang</Text>
          <View>
            <Image source={images.reset} className="size-5 mt-auto" tintColor="#fff"/>
          </View>
        </TouchableOpacity>
      </View>
 
      <ScrollView className="flex px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
            paddingBottom: 10
        }}>

        <FlatList
          data={fakeData}
          renderItem={({item}) => (
            
            <CardBarang {...item} isCashier={true} value={keranjang.find((i) => item.id == i.id)?.quantity ?? 0} handleIncrement={() => handleIncrement(item.id, item.nama, item.harga)} handleDecrement={() => handleDecrement(item.id)} />     
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            // marginHorizontal: "auto",
            paddingRight: 5,
            marginBottom: 10
          }}
          className="mt-5 w-full"
          ListEmptyComponent={<>
            <Text className="text-center mt-5">Waduhh.., barang gak ada di database nihhh</Text>
          </>}
          scrollEnabled={false}
        />

        {/* <Link href={{ pathname: "/kasir" }} asChild> */}
          <View className="flex-1 bg-blue-500 p-5 rounded-md"
          >
            <Text className="font-bold text-white text-center">
              Total Harga: Rp. {totalHarga.toLocaleString()}
            </Text>
          </View>
        {/* </Link> */}
        
      </ScrollView>
    </View>
  );
}
