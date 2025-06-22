import { KeranjangProvider } from "@/context/keranjang-context";
import { Stack } from "expo-router";
import './global.css';


export default function RootLayout() {
  return (
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
      </Stack>
    </KeranjangProvider>
  );
}
