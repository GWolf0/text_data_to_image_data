import { createContext, useState } from "react";

const mainContext=createContext();

function MainContextProvider({children}){
//states

//methods

return (
    <mainContext.Provider value={{}}>
        {children}
    </mainContext.Provider>
);
}

/!This file is unused!/