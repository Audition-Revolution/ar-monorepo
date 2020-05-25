import React, {createContext, useState} from "react";

export const GlobalContext = createContext<{state: GlobalState, setState: any}>({
    state: {userId: '', userType: [], userEmail: '', displayName: '', theatreVerified: false, verified: false},
    setState: () => {}
});
interface GlobalState {
    userId: string;
    userType: string[];
    userEmail: string;
    displayName: string;
    theatreVerified: boolean;
    verified: boolean;
}

export const GlobalContextProvider = (props: any) => {
    const [state, setState] = useState<GlobalState>({} as GlobalState);
    return (
        <GlobalContext.Provider
            value={{
                state,
                setState
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};
