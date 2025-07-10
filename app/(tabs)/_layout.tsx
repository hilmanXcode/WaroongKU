import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

const _Layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                title: "Kasir",
                headerShown: false,
                tabBarIcon: ({color, size}) => <Ionicons name='cart' color={color} size={size} />
            }}
        />

        <Tabs.Screen
            name="barang"
            options={{
                title: "Manage Barang",
                headerShown: false,
                tabBarIcon: ({color, size}) => <Ionicons name='logo-dropbox' color={color} size={size} />
            }}
        />

         <Tabs.Screen
            name="transaksi"
            options={{
                title: "Riwayat Transaksi",
                headerShown: false,
                tabBarIcon: ({color, size}) => <Ionicons name='time' color={color} size={size} />
            }}
        />
    </Tabs>
  )
}

export default _Layout