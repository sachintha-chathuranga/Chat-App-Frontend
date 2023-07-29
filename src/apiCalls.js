import axios from "axios";
import { LoginFailure, LoginStart, LoginSuccess, LogOut, UpdateStart, UpdateFailure, ClearError } from "./context/AuthActions";

const API_URL = process.env.REACT_APP_API_URL;

export const loginCall = async (userCredintial, dispatch) =>{
    dispatch(LoginStart(userCredintial));
    try{
        const res = await axios.post(`${API_URL}users/login`, userCredintial);
        dispatch(LoginSuccess(res.data));
        sessionStorage.setItem("user", JSON.stringify(res.data));
        return res.status;
    }catch(err){
        if(!err?.response){
            dispatch(LoginFailure("No Sever Response"));
            return 500;
        }else if(err.response?.data){
            dispatch(LoginFailure(err.response.data));
            return err.response.status;
        }else{
            dispatch(LoginFailure("You are currently offline. Check your internet Connection!"));
            return 500;
        }
    }
}

export const signUpCall = async (userCredintial, dispatch) =>{
    dispatch(LoginStart());
    try{
        const res = await axios.post(`${API_URL}users/signUp`, userCredintial);
        dispatch(LoginSuccess(res.data));
        return res.status;
    }catch(err){
        if(!err?.response){
            dispatch(LoginFailure("No Sever Response"));
            return 500;
        }else if(err.response?.data){
            dispatch(LoginFailure(err.response.data));
            return err.response.status;
        }else{
            dispatch(LoginFailure("You are currently offline. Check your internet Connection!"));
            return 500;
        }
    }
}
export const userUpdateCall = async (userCredintial, dispatch) =>{
    dispatch(UpdateStart());
    try{
        const res = await axios.put(`${API_URL}users/${userCredintial.user_id}`, userCredintial);
        dispatch(LoginSuccess(res.data));
        return res.status;
    }catch(err){
        if(!err?.response){
            dispatch(UpdateFailure("No Sever Response"));
            return 500;
        }else if(err.response?.data){
            dispatch(UpdateFailure(err.response.data));
            return err.response.status;
        }else{
            dispatch(UpdateFailure("You are currently offline. Check your internet Connection!"));
            return 500;
        }
    } 
}

export const userDeleteCall = async (userCredintial, dispatch) =>{
    dispatch(UpdateStart());
    axios.delete(`${API_URL}users/${userCredintial.user_id}`, {data : userCredintial}).then(res => {
        dispatch(LogOut());
        return res.status;
    }).catch(err =>{
        if(!err?.response){
            dispatch(UpdateFailure("No Sever Response"));
            return 500;
        }else if(err.response?.data){
            dispatch(UpdateFailure(err.response.data));
            return err.response.status;
        }else{
            dispatch(UpdateFailure("You are currently offline. Check your internet Connection!"));
            return 500;
        }
    });
}

export const logOutCall = async (userCredintial, dispatch) =>{
        axios.put(`${API_URL}users/${userCredintial.user_id}`, userCredintial).then((res) =>{
            sessionStorage.removeItem("user");
            dispatch(LogOut());
            return res.status;
        }).catch(err =>{
            if(!err?.response){
                dispatch(UpdateFailure("No Sever Response"));
                return 500;
            }else if(err.response?.data){
                dispatch(UpdateFailure(err.response.data));
                return err.response.status;
            }else{
                dispatch(UpdateFailure("You are currently offline. Check your internet Connection!"));
                return 500;
            };
        });
}
export const clearError = (dispatch) =>{
    dispatch(ClearError());
}

export const getSignRequest = async (file) =>{
    try{
        const res = await axios.get(`${API_URL}aws/sign-s3?file_name=${encodeURIComponent(file.name)}&file_type=${file.type}`);
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
        if(!err?.response){
            dispatch(UpdateFailure("No Sever Response"));
            return 500;
        }else if(err.response?.data){
            dispatch(UpdateFailure(err.response.data));
            return err.response.status;
        }else{
            dispatch(UpdateFailure("You are currently offline. Check your internet Connection!"));
            return 500;
        };
    }
}
export const clearMessages = async (friend_id, user_id) =>{
    axios.delete(`${API_URL}messages/messages/clear/${user_id}?friend_id=${friend_id}`).then(res => {
        console.log(res.data);
    }).catch(err =>{
        console.log(err.response);
    });
}

export const fetchFriend = async (index=1, user_id) => {
    const res = await axios.get(`${API_URL}users/friends/?index=${index}&user_id=${user_id}`);
    return res.data;
}

export const searchFriend = async (index, user_id, searchInput) => {
    const res = await axios.post(index ? `${API_URL}users/search/${user_id}?index=${index}` : `${API_URL}users/search/${user_id}`, {name: searchInput});
    return res.data;
}
export const fetchMessages = async (user_id, friend_id) => {
    const res = await axios.get(`${API_URL}messages/message?user_id=${user_id}&friend_id=${friend_id}`);
    return res.data;
}

