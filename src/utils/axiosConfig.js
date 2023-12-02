import axios from "axios"
import { api } from "../constants"

const token = JSON.parse(localStorage.getItem("token"))

export const authInstance = axios.create({
    baseURL: api,
    headers: { 'Authorization': `Bearer ${token}` }
})

