'use client'

import { SQLiteDatabase } from "expo-sqlite";
import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from "react";



const DatabaseValueContext = createContext<SQLiteDatabase | null>(null);
const DatabaseUpdateContext = createContext<Dispatch<SetStateAction<SQLiteDatabase | null>>| null>(null);

interface Provider {
    children: ReactNode
}

export const DatabaseProvider = ({ children }: Provider) => {
  const [database, setDatabase] = useState<SQLiteDatabase | null>(null);

  return (
    <DatabaseValueContext.Provider value={database}>
      <DatabaseUpdateContext.Provider value={setDatabase}>
        {children}
      </DatabaseUpdateContext.Provider>
    </DatabaseValueContext.Provider>
  )
}

export const useDatabase = () => {
  const context = useContext(DatabaseValueContext);
  return context;
}

export const useSetDatabase = () => {
  const context = useContext(DatabaseUpdateContext);
  return context;
}