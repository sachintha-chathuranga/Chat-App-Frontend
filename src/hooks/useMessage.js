import { useState, useEffect } from 'react';
import { fetchMessages} from '../apiCalls';

const useMessage = (user_id, friend_id, active, scrolltoBottom) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [error, seterror] = useState(null);
    
    useEffect(() => {
        setisLoading(true);
        const interval = setInterval(() => {
            fetchMessages(user_id, friend_id)
            .then(d => {
                setMessages(d);
                setisLoading(false);
                !active && scrolltoBottom();
            })
            .catch(e => {
                if(!e?.response){
                    seterror("No Sever Response");
                }else if(e.response?.data){
                    seterror(e.response.data);
                }else{
                    seterror("You are currently offline. Check your internet Connection!");
                };
                setisLoading(false);
            });
        }, 500);
        return () => clearInterval(interval);
    }, [user_id, friend_id, active, scrolltoBottom]);

    return { messages, isLoading, error};
}

export default useMessage;
