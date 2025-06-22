'use client'

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";


interface KeranjangItem {
  id: string;
  nama_barang: string;
  harga: number;
  quantity: number;
}


interface KeranjangContextType {
  keranjang: KeranjangItem[];
  setKeranjang: Dispatch<SetStateAction<KeranjangItem[]>>;
}

const KeranjangContext = createContext<KeranjangContextType | undefined>(undefined);

interface KeranjangProviderProps {
  children: ReactNode;
}

export const KeranjangProvider = ({ children }: KeranjangProviderProps) => {
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);

  return (
    <KeranjangContext.Provider value={{ keranjang, setKeranjang }}>
      {children}
    </KeranjangContext.Provider>
  );
};

export const useKeranjangContext = () => {
  const context = useContext(KeranjangContext);
  if (!context) {
    throw new Error("keranjangContext harus di gunakan di dalam provider!");
  }
  return context;
};
