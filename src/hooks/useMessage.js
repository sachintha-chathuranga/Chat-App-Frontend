import { useState, useEffect } from 'react';
import { fetchMessages} from '../apiCalls';
import useAxiosPrivate from './useAxiosPrivate';

const useMessage = (friend_id, scrolltoBottom) => {
    const [isMount, setisMount] = useState(true);
    const [messages, setMessages] = useState([]);
    const [error, seterror] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
            fetchMessages(axiosPrivate, friend_id)
            .then(d => {
                isMount && setMessages(d);
                scrolltoBottom();
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
        return () => {
            setisMount(false);
        };
    }, [friend_id, scrolltoBottom, axiosPrivate, isMount]);

    return { messages, setMessages, error};
}

export default useMessage;
