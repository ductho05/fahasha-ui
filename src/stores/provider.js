import { useReducer } from "react";
import reducer, { initialState } from "./reducer";
import userContext from "./context.";

function UserProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <userContext.Provider value={[state, dispatch]}>
            {children}
        </userContext.Provider>
    )
}

export default UserProvider;
