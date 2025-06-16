import CardBarang from "@/components/CardBarang";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import getDatabase from "@/database/sqlite";
import { SQLiteDatabase } from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {
  const [database, setDatabase] = useState<SQLiteDatabase | null>(null)

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

  const fakeData = [
    {
      "id": "123123",
      "nama": "Indomie Goreng",
      "barcode": "123121231233331222",
      "harga": 3500
    },
    {
      "id": "1234",
      "nama": "Bakwan Geming",
      "barcode": "123121231233331222",
      "harga": 5000
    },
    {
      "id": "0123123",
      "nama": "Cuanki",
      "barcode": "123121231233331222",
      "harga": 10000
    },
    {
      "id": "0123123",
      "nama": "Sepatu Geming",
      "barcode": "123121231233331222",
      "harga": 500000
    },
    {
      "id": "0123123",
      "nama": "Laptop Bekas",
      "barcode": "123121231233331222",
      "harga": 1000
    }
  ];


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
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
            minHeight: "100%", paddingBottom: 10
        }}>

        <FlatList
          data={fakeData}
          renderItem={({item}) => (
            <CardBarang {...item}/> 
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
          scrollEnabled={false}
        />
        
      </ScrollView>
    </View>
  );
}
