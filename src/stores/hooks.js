import { useContext } from "react";
import userContext from "./context.";
import { isSuperAdminContext } from "./context.";
export const useStore = () => {
    const [state, dispatch] = useContext(userContext);

    return [state, dispatch]
}

// export const useSuperAdmin = () => {
//     const [isSuperAdmin, setIsSuperAdmin] = useContext(isSuperAdminContext);

//     return [isSuperAdmin, setIsSuperAdmin]
// }
