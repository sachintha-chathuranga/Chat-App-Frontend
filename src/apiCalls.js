import axios from "axios";
import { LoginFailure, LoginStart, LoginSuccess, LogOut, UpdateStart, UpdateFailure, ClearError } from "./context/AuthActions";

const API_URL = process.env.REACT_APP_API_URL;
const API_AWS_URL = process.env.REACT_APP_API_URL_AWS;

export const loginCall = async (userCredintial, dispatch) =>{
    dispatch(LoginStart(userCredintial));
    try{
        const res = await axios.post(`${API_URL}login`, userCredintial);
        dispatch(LoginSuccess(res.data));
        sessionStorage.setItem("user", JSON.stringify(res.data));
        return res.status;
    }catch(err){
        dispatch(LoginFailure(err.response.data));
        return err.response.status;
    }
}

export const signUpCall = async (userCredintial, dispatch) =>{
    dispatch(LoginStart());
    try{
        const res = await axios.post(`${API_URL}signUp`, userCredintial);
        dispatch(LoginSuccess(res.data));
        return res.status;
    }catch(err){
        dispatch(LoginFailure(err.response.data));
        return err.response.status;
    }
}
export const userUpdateCall = async (userCredintial, dispatch) =>{
    dispatch(UpdateStart());
    try{
        const res = await axios.put(`${API_URL}${userCredintial.user_id}`, userCredintial);
        dispatch(LoginSuccess(res.data));
        return null;
    }catch(err){
        dispatch(UpdateFailure(err.response.data));
        return err;
    } 
}

export const userDeleteCall = async (userCredintial, dispatch) =>{
    dispatch(UpdateStart());
    axios.delete(`${API_URL}${userCredintial.user_id}`, {data : userCredintial}).then(res => {
        dispatch(LogOut());
    }).catch(err =>{
        dispatch(UpdateFailure(err.response.data));
    });
}

export const logOutCall = async (userCredintial, dispatch) =>{
        axios.put(`${API_URL}${userCredintial.user_id}`, userCredintial).then(() =>{
            dispatch(LogOut());
            sessionStorage.removeItem("user");
        }).catch(err =>{
            dispatch(UpdateFailure(err.response.data));
        });
}
export const clearError = (dispatch) =>{
    dispatch(ClearError());
}

export const getSignRequest = async (file) =>{
    try{
        const res = await axios.get(`${API_AWS_URL}sign-s3?file_name=${encodeURIComponent(file.name)}&file_type=${file.type}`);
        return res.data;
    }catch(err){
        return err.response.data;
    }
}

export const uploadFile = async (file, signReq, dispatch) =>{
    dispatch(UpdateStart());
    try{
        const res = await axios.put(signReq, file);
        dispatch(ClearError());
        return res.status;
    }catch(err){
        return err;
    }
}