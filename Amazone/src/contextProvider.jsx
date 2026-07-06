import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
const colorContext=createContext()
export const useColor=()=>{
    return useContext(colorContext);
}
export const ThemeProvider=({children})=>{
    const [color,setcolor]=useState('light')
    const colorToggler=()=>{
        setcolor((pre)=>pre==='light'?'dark':'light')
    }

return(
    <colorContext.Provider value={{colorToggler}}>{children}</colorContext.Provider>

)}