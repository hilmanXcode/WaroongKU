import { Stack } from "expo-router";
import './global.css';


export default function RootLayout() {
  return (
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
        name="kasir/index"
        options={{headerShown: false}}
      />    
    </Stack>
  );
}
