import { REGISTER, LOGIN, LOGOUT, UPDATE, NOACTION, SEENOTICE } from './constants';
import localstorge from './localstorge';
import { socket } from '../service/SocketIo';
import { authInstance } from '../utils/axiosConfig';

var user = {};
var token = localstorge.get();
var sk = socket
if (token) {
    await authInstance.get("/users/get/profile")
        .then((result) => {
            if (result.data.status === 'OK') {
                user = { ...result.data.data };
            }
        })
        .catch((err) => {
            console.log('get user', err);
        });
}
const initialState = {
    user: user,
    token: token,
    action: '',
    isLoggedIn: localstorge.get().length > 0,
    socket: sk
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
            };

        case LOGIN:
            localstorge.set(action.payload.token);

            return {
                ...state,
                user: action.payload.data,
                token: action.payload.token,
                action: LOGIN,
            };

        case LOGOUT:
            localstorge.delete();
            return {
                ...state,
                user: {},
                token: '',
                action: LOGOUT,
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
