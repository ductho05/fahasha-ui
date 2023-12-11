import axios from "axios"
import React from "react"
import { api } from "../constants"
import { useStore } from "../stores/hooks"

export const getAuthInstance = () => {

    return axios.create({
        baseURL: api,
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    })
}

