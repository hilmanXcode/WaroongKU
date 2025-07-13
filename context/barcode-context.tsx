'use client'

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";



const BarcodeValueContext = createContext<string | undefined>(undefined);
const BarcodeUpdateContext = createContext<Dispatch<SetStateAction<string>>| undefined>(undefined);

interface Provider {
    children: ReactNode
}

export const BarcodeProvider = ({ children }: Provider) => {
  const [barcode, setBarcode] = useState<string>('');

  return (
    <BarcodeValueContext.Provider value={barcode}>
      <BarcodeUpdateContext.Provider value={setBarcode}>
        {children}
      </BarcodeUpdateContext.Provider>
    </BarcodeValueContext.Provider>
  )
}

export const useBarcode = () => {
  const context = useContext(BarcodeValueContext);
  if(context === undefined){
    throw new Error("BarcodeContext harus di gunakan di dalam provider");
  }
  return context;
}

export const useSetBarcode = () => {
  const context = useContext(BarcodeUpdateContext);
  if(context === undefined){
    throw new Error("BarcodeContext harus di gunakan di dalam provider");
  }
  return context;
}