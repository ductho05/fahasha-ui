import { api } from '../constants';
const key = 'token';

export default {
    get() {
        return JSON.parse(localStorage.getItem(key)) || {};
    },

    set(value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    delete() {
        localStorage.removeItem(key);
    },

    async getUser() {
        let user = {};
        let token = JSON.parse(localStorage.getItem(key));
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

        console.log('get user', user);
        return user;
    },
};
