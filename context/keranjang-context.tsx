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


const KeranjangValueContext = createContext<KeranjangItem[] | undefined>(undefined);
const KeranjangUpdateContext = createContext<Dispatch<SetStateAction<KeranjangItem[]>>| undefined>(undefined);

interface KeranjangProviderProps {
  children: ReactNode;
}

export const KeranjangProvider = ({ children }: KeranjangProviderProps) => {
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);

  return (
    <KeranjangValueContext.Provider value={keranjang}>
      <KeranjangUpdateContext.Provider value={setKeranjang}>
        {children}
      </KeranjangUpdateContext.Provider>
    </KeranjangValueContext.Provider>
  );
};

export const useKeranjang = () => {
  const context = useContext(KeranjangValueContext);
  if (!context) {
    throw new Error("useKeranjang harus di gunakan di dalam provider!");
  }
  return context;
};

export const useSetKeranjang = () => {
  const context = useContext(KeranjangUpdateContext);
  if (!context) {
    throw new Error("setKeranjang harus di gunakan di dalam provider!");
  }
  return context;
};
