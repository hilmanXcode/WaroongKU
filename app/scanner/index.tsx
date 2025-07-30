import { useBarang } from "@/context/barang-context"
import { useSetBarcode } from "@/context/barcode-context"
import { useKeranjang, useSetKeranjang } from "@/context/keranjang-context"
import { Ionicons } from "@expo/vector-icons"
import { Camera, CameraView } from "expo-camera"
import { router, useLocalSearchParams } from "expo-router"
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from "react-native-toast-message"
import Overlay from "./overlay"


interface dataBarang {
  id: string;
  nama_barang: string;
  barcode: string;
  harga: number;
}

const index = () => {

  const barang = useBarang();
  const keranjang = useKeranjang();
  const setKeranjang = useSetKeranjang();
  const [ scanned, setScanned ] = useState(false);
  const { tambahBarang, editBarang } = useLocalSearchParams();
  const setBarcode = useSetBarcode();
  const [wrongScan, setWrongScan] = useState(false);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleScan = useCallback(({bounds, data}: any) => {
    const { size } = bounds;
    
    if(size.width <= 90 && size.height <= 90)
    {
      setWrongScan(true);
      return;
    }

    setTimeout(() => {
      setWrongScan(false);
      if(tambahBarang && data && !scanned){
        setBarcode(data)
        setScanned(true);
      }
      else if(editBarang && data && !scanned){
        const scannedData: dataBarang | undefined = barang.find((item) => item.barcode === data);
        if(!scannedData){
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Barang tidak ditemukan',
            position: 'bottom',
            swipeable: false,
            bottomOffset: 80,
            visibilityTime: 900
          });
          return;
        }

        router.push(`/barang/${scannedData.id}`)
        setScanned(true);
      }
      else if(!tambahBarang && !scanned) {
        setScanned(true);
        const scannedData: dataBarang | undefined = barang.find((item) => item.barcode === data);

        if(!scannedData){
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Barang tidak ditemukan',
            position: 'bottom',
            swipeable: false,
            bottomOffset: 80,
            visibilityTime: 900
          });
          return;
        }

        if(scannedData){
          
          if(keranjang.find((item) => item.barcode === data)){
            setKeranjang(prevKeranjang => {
                return prevKeranjang.map(item => item.barcode === data ? {...item, quantity: item.quantity + 1} : item)
            });
          }
          else {

              setKeranjang((keranjang) => [
                  ...keranjang,
                  {id: scannedData.id, nama_barang: scannedData.nama_barang, barcode: scannedData.barcode, harga: scannedData.harga, quantity: 1}
              ])
          } 
        }

      }
    }, 500)
    router.back()
  }, [scanned, barang, keranjang, setKeranjang])

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View className="flex-1 flex-col justify-center">
      {!scanned && (
        <>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleScan}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "ean13"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity activeOpacity={0.8} onPress={router.back} className="absolute bg-white z-20 top-16 p-5 rounded-full left-5">
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          {wrongScan && (
            <View className="absolute top-64 z-20 w-full p-10">
              <View className="flex-row justify-center gap-2 items-center p-7 rounded-lg bg-white">
                <Ionicons name="warning" size={20} />
                <Text className="font-bold">Mohon dekatkan dan masukkan barcode ke dalam area</Text>
              </View>
            </View>
          )}
          
          <Overlay/>
        </>
      )}
    </View>
  )
}

export default index