import { useContext } from "react";
import userContext from "./context.";

export const useStore = () => {
    const [state, dispatch] = useContext(userContext);

    return [state, dispatch]
}
