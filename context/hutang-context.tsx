'use client'

import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";


interface hutang {
    id: number
    detail_hutang: string
    nama_pembeli: string
    total_bayar: number
    tanggal: string
    waktu: string
}



const HutangValueContext = createContext<hutang[] | undefined>(undefined);
const HutangUpdateContext = createContext<Dispatch<SetStateAction<hutang[]>>| undefined>(undefined);

interface Provider {
  children: ReactNode;
}

export const HutangProvider = ({ children }: Provider) => {
  const [hutang, setHutang] = useState<hutang[]>([]);

  return (
    <HutangValueContext.Provider value={hutang}>
      <HutangUpdateContext.Provider value={setHutang}>
        {children}
      </HutangUpdateContext.Provider>
    </HutangValueContext.Provider>
  );
};

export const useHutang = () => {
  const context = useContext(HutangValueContext);
  if (!context) {
    throw new Error("useKeranjang harus di gunakan di dalam provider!");
  }
  return context;
};

export const useSetHutang = () => {
  const context = useContext(HutangUpdateContext);
  if (!context) {
    throw new Error("setKeranjang harus di gunakan di dalam provider!");
  }
  return context;
};
