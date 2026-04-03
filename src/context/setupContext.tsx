import { ReactNode, createContext, useEffect, useState } from 'react'
import { INITIAL_SETUP } from '../constants/setup'
import { SetupContextType } from '../interfaces/interfaces'

export const SetupContext = createContext<SetupContextType | null>(null);

interface Props {
    children: ReactNode
}

export const SetupProvider = ({children}:Props) => {
    
    const [setup, setSetup] = useState(INITIAL_SETUP);

    useEffect(() => {
        console.log("Setup changed!", setup);
    }, [setup])

    return (
        <SetupContext.Provider value={{setup, setSetup}}>
            { children }
        </SetupContext.Provider>
    ) 
}