'use client'

import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";


interface Barang {
  id: string;
  nama_barang: string;
  barcode: string
  harga: number;
}


interface BarangContextType {
  barang: Barang[];
  setBarang: Dispatch<SetStateAction<Barang[]>>;
}

const BarangContext = createContext<BarangContextType | undefined>(undefined);

interface BarangProviderProps {
  children: ReactNode;
}

export const BarangProvider = ({ children }: BarangProviderProps) => {
  const [barang, setBarang] = useState<Barang[]>([]);

  return (
    <BarangContext.Provider value={{ barang, setBarang }}>
      {children}
    </BarangContext.Provider>
  );
};

export const useBarangContext = () => {
  const context = useContext(BarangContext);
  if (!context) {
    throw new Error("BarangContext harus di gunakan di dalam provider!");
  }
  return context;
};
