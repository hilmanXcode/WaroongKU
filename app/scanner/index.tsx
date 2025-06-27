import { useBarang } from "@/context/barang-context"
import { useKeranjang, useSetKeranjang } from "@/context/keranjang-context"
import { OnSuccessfulScanProps, QRCodeScanner, QRCodeValidator } from "@masumdev/rn-qrcode-scanner"
import { router } from "expo-router"
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Toast from "react-native-toast-message"

interface dataBarang {
  id: string;
  nama_barang: string;
  harga: number;
}

const index = () => {

  const barang = useBarang();
  const keranjang = useKeranjang();
  const setKeranjang = useSetKeranjang();
  const [ scanned, setScanned ] = useState(false);

  const handleScan = useCallback((data: OnSuccessfulScanProps) => {
    setTimeout(() => {
      if(scanned) return;
      setScanned(false);
      const scannedData: dataBarang | undefined = barang.find((item) => item.id === data.code);

      if(!scannedData){
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Barang',
          position: 'bottom',
          swipeable: false,
          bottomOffset: 80,
          visibilityTime: 900
        });
        return;
      }

      if(scannedData){
        
        if(keranjang.find((item) => item.id === data.code)){
          setKeranjang(prevKeranjang => {
              return prevKeranjang.map(item => item.id === data.code ? {...item, quantity: item.quantity + 1} : item)
          });
        }
        else {
            // console.log("MASUK SINI")

            setKeranjang((keranjang) => [
                ...keranjang,
                {id: scannedData.id, nama_barang: scannedData.nama_barang, harga: scannedData.harga, quantity: 1}
            ])
        } 
      }
      
      router.back()
    }, 500)
    
  }, [scanned, barang, keranjang, setKeranjang])

  const validateQRCode: QRCodeValidator = useCallback((code: string) => {
    if(barang.find((item) => item.id === code))
      return {valid: true, code, message: "Barang ditemukan"}
    else
      return {valid: false, code}
  }, [barang])

  return (
    <View style={StyleSheet.absoluteFillObject} className="absolute">
      {!scanned && (<QRCodeScanner
        core={{
          onSuccessfulScan: handleScan,
          validate: validateQRCode
        }}
        permissionScreen={{
          props:{
            title: "Izinkan Kamera",
            subtitle: "Mohon izinkan kamera agar kamu dapat menggunakan fitur ini",
            buttonBackgroundColor: "#3b82f6",
          }
        }}
      />
      )}
    </View>
  )
}

export default index