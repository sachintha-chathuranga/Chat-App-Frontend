import { useState, useEffect } from 'react';
import { fetchMessages} from '../apiCalls';
import useAxiosPrivate from './useAxiosPrivate';

const useMessage = (friend_id, active, scrolltoBottom) => {
    const [isMount, setisMount] = useState(true);
    const [messages, setMessages] = useState([]);
    const [error, seterror] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages(axiosPrivate, friend_id)
            .then(d => {
                isMount && setMessages(d);
                !active && scrolltoBottom();
            })
            .catch(e => {
                if(!e?.response){
                    isMount && seterror("No Sever Response");
                }else if(e.response?.data){
                    isMount && seterror(e.response.data);
                }else{
                    isMount && seterror("You are currently offline. Check your internet Connection!");
                };
            });
        }, 500);
        return () => {
            setisMount(false);
            clearInterval(interval)};
    }, [friend_id, active, scrolltoBottom, axiosPrivate, isMount]);

    return { messages, error};
}

export default useMessage;
