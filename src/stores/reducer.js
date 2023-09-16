import { REGISTER, LOGIN, LOGOUT, UPDATE, NOACTION } from './constants';
import { api } from '../constants';
import localstorge from './localstorge';

var user = {};
var token = localstorge.get();
if (token) {
    await fetch(`${api}/users/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.status === 'OK') {
                user = { ...result.data };
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
            console.log('login');
            return {
                ...state,
                user: action.payload.data,
                token: action.payload.token,
                action: LOGIN,
            };

        case LOGOUT:
            localstorge.delete();
            console.log('logout');
            return {
                ...state,
                user: {},
                token: '',
                action: LOGOUT,
            };

        case UPDATE:
            return {
                ...state,
                user: {},
                token: '',
                action: UPDATE,
            };

        case NOACTION:
            return {
                ...state,
                action: '',
            };
        default:
            throw new Error(`Invalid action ${action.type}`);
    }
}

export { initialState };
export default Reducer;
