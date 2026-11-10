import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const publicApi = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-type': 'application/json'
    },
    withCredentials: true
});

export const tokenApi = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-type': 'application/json'
    },
    withCredentials: true
});
