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


const BarangValueContext = createContext<Barang[] | undefined>(undefined);
const BarangUpdateContext = createContext<Dispatch<SetStateAction<Barang[]>>| undefined>(undefined);

interface BarangProviderProps {
  children: ReactNode;
}

export const BarangProvider = ({ children }: BarangProviderProps) => {
  const [barang, setBarang] = useState<Barang[]>([]);

  return (
    <BarangValueContext.Provider value={barang}>
      <BarangUpdateContext.Provider value={setBarang}>
        {children}
      </BarangUpdateContext.Provider>
    </BarangValueContext.Provider>
  );
};

export const useBarang = () => {
  const context = useContext(BarangValueContext);
  if (!context) {
    throw new Error("BarangContext harus di gunakan di dalam provider!");
  }
  return context;
};


export const useSetBarang = () => {
  const context = useContext(BarangUpdateContext);
  if (!context) {
    throw new Error("BarangContext harus di gunakan di dalam provider!");
  }
  return context;
};
