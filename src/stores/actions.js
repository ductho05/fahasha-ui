import { REGISTER, LOGIN, LOGOUT, NOACTION, SEENOTICE, UPDATE } from './constants';

export const register = (payload) => {
    return {
        type: REGISTER,
        payload,
    };
};

export const login = (payload) => {
    return {
        type: LOGIN,
        payload,
    };
};

export const logout = (payload) => {
    return {
        type: LOGOUT,
        payload,
    };
};

export const update = (payload) => {
    return {
        type: UPDATE,
        payload,
    };
};

export const noAction = () => {
    return {
        type: NOACTION,
    };
};

export const seeNotice = () => {
    return {
        type: SEENOTICE,
    };
};
