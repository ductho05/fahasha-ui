import localstorge from "./localstorge"
import { api } from "../constants"

export const isLogin = () => {
    return Object.keys(localstorge.get()).length > 0
}
export const isExpired = (setResult) => {

}