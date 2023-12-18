import io from 'socket.io-client';
import { isDeploy } from '../constants/index';
export const socket = io(!isDeploy ? 'http://127.0.0.1:3000' : 'https://bookstore-ta-v3.onrender.com');
