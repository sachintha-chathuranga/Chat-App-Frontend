import axios from "axios";
import { LoginFailure, LoginStart, LoginSuccess, LogOut, UpdateStart, UpdateFailure, ClearError } from "./context/AuthActions";

const API_URL = process.env.REACT_APP_API_URL;

export const loginCall = async (userCredintial, dispatch) =>{
    dispatch(LoginStart(userCredintial));
    try{
        const res = await axios.post(`${API_URL}login`, userCredintial);
        dispatch(LoginSuccess(res.data));
    }catch(err){
        dispatch(LoginFailure(err.response.data));
    }
}

export const signUpCall = async (userCredintial, dispatch) =>{
    dispatch(LoginStart());
    try{
        const res = await axios.post(`${API_URL}signUp`, userCredintial);
        dispatch(LoginSuccess(res.data));
        return res.data;
    }catch(err){
        dispatch(LoginFailure(err.response.data));
        return err.response.data;
    }
}
export const userUpdateCall = async (userCredintial, dispatch) =>{
    dispatch(UpdateStart());
    try{
        const res = await axios.put(`${API_URL}${userCredintial.user_id}`, userCredintial);
        dispatch(LoginSuccess(res.data));
    }catch(err){
        dispatch(UpdateFailure(err.response.data));
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

export const logOutCall = (userCredintial, dispatch) =>{
        axios.put(`${API_URL}${userCredintial.user_id}`, userCredintial).then(() =>{
            dispatch(LogOut());
        }).catch(err =>{
            dispatch(UpdateFailure(err.response.data));
        });
}
export const clearError = (dispatch) =>{
    dispatch(ClearError());
}
