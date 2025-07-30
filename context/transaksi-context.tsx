'use client'

import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";


interface transaksiData {
    id: number
    detail_id: string
    tanggal: string
    waktu: string
}


const TransaksiValueContext = createContext<transaksiData[] | undefined>(undefined)
const TransaksiUpdateContext = createContext<Dispatch<SetStateAction<transaksiData[]>> | undefined>(undefined)

interface TransaksiProviderProps {
    children: ReactNode
}

export const TransaksiProvider = ({ children }: TransaksiProviderProps) => {
    const [transaksi, setTransaksi] = useState<transaksiData[]>([]);

    return (
        <TransaksiValueContext.Provider value={transaksi}>
            <TransaksiUpdateContext.Provider value={setTransaksi}>
                {children}
            </TransaksiUpdateContext.Provider>
        </TransaksiValueContext.Provider>
    )
}

export const useTransaksi = () => {
    const context = useContext(TransaksiValueContext)
    if(!context){
        throw new Error("TransaksiContext harus digunakan dalam provider!")
    }
    return context;
}

export const useSetTransaksi = () => {
    const context = useContext(TransaksiUpdateContext)
    if(!context){
        throw new Error("TransaksiContext harus digunakan dalam provider!")
    }
    return context
}