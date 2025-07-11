import { BarangProvider } from "@/context/barang-context";
import { BarcodeProvider } from "@/context/barcode-context";
import { KeranjangProvider } from "@/context/keranjang-context";
import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import './global.css';


export default function RootLayout() {
  return (
    <BarangProvider>
        <BarcodeProvider>
          <KeranjangProvider>
              <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{headerShown: false}}
                    />
                  <Stack.Screen
                    name="barang/[id]"
                    options={{headerShown: false}}
                    />
                  <Stack.Screen
                    name="keranjang/index"
                    options={{headerShown: false}}
                    />
                  <Stack.Screen
                    name="scanner/index"
                    options={{headerShown: false}}
                    />
              </Stack>
              <Toast/>
          </KeranjangProvider>
        </BarcodeProvider>
      </BarangProvider>
  
  );
}
