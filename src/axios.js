import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const axiosPublic = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-type': 'application/json'
    },
    withCredentials: true
});
