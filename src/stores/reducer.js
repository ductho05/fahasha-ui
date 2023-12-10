import { REGISTER, LOGIN, LOGOUT, UPDATE, NOACTION, SEENOTICE } from './constants';
import localstorge from './localstorge';
import { socket } from '../service/SocketIo';
import { api } from "../constants"
import axios from "axios"

var user = {};
var token = localstorge.get();
var sk = socket
if (Object.keys(token).length > 0) {

    await axios.get(`${api}/users/get/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(result => {

        if (result.data.status === 'OK') {
            user = { ...result.data.data };
        }
    }).catch((err) => {
        console.log('get user', err);
    })
}
const initialState = {
    user: user,
    token: token,
    action: '',
    isLoggedIn: localstorge.get().length > 0,
    socket: sk,
    authInstance: axios.create({
        baseURL: api,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
};

function Reducer(state, action) {
    switch (action.type) {
        case REGISTER:

            localstorge.set(action.payload.token);
            return {
                ...state,
                user: action.payload.data,
                token: action.payload.token,
                action: REGISTER,
                isLoggedIn: true,
                authInstance: axios.create({
                    baseURL: api,
                    headers: {
                        'Authorization': `Bearer ${action.payload.token}`
                    }
                })
            };

        case LOGIN:
            localstorge.set(action.payload.token);

            return {
                ...state,
                user: action.payload.data,
                token: action.payload.token,
                action: action.type,
                isLoggedIn: true,
                authInstance: axios.create({
                    baseURL: api,
                    headers: {
                        'Authorization': `Bearer ${action.payload.token}`
                    }
                })
            };

        case LOGOUT:
            localstorge.delete();
            return {
                ...state,
                user: {},
                token: '',
                action: LOGOUT,
                isLoggedIn: false,
            };

        case UPDATE:
            return {
                ...state,
                user: action.payload.data,
                action: UPDATE,
            };

        case NOACTION:
            return {
                ...state,
                action: '',
            };

        case SEENOTICE:
            return {
                ...state,
                action: SEENOTICE,
            };
        default:
            throw new Error(`Invalid action ${action.type}`);
    }
}

export { initialState };
export default Reducer;
