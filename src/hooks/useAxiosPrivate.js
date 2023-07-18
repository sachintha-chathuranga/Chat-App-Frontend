import { useContext, useEffect } from "react";
import { getNewToken } from "../apiCalls";
import { axiosPrivate } from "../axios"
import { AuthContext } from "../context/AuthContext";

const useAxiosPrivate = () => {
    const {user, dispatch} = useContext(AuthContext);
    
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${user?.access_token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (err) =>{
                const prevRequest = err?.config;
                if(err?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const token = await getNewToken(dispatch);
                    if(token){
                        prevRequest.headers['Authorization'] = `Bearer ${token}`;
                        return axiosPrivate(prevRequest);
                    }
                    return Promise.reject(err);
                }
                return Promise.reject(err);
            }
        )

        return () =>{
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
     
    }, [user, dispatch]);

    return axiosPrivate;
}

export default useAxiosPrivate;
