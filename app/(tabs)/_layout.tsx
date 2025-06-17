import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, View } from 'react-native'

const TabIcon = ({focused, icon}: any) => {
    if(focused){
        return (

        <View className=''>
            <Image source={icon} tintColor="#3b82f6" className="size-9"/>
        </View>
        )
    }
    
    return (

        <View className=''>
            <Image source={icon} tintColor="#000" className="size-9"/>
        </View>
    )

}

const _Layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                title: "Kasir",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} icon={images.cart} />
                )
            }}
        />

        <Tabs.Screen
            name="barang"
            options={{
                title: "Manage Barang",
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <TabIcon focused={focused} icon={images.kardus}/>
                )
            }}
        />
    </Tabs>
  )
}

export default _Layout