import { useState, useEffect } from 'react';
import { fetchFriend, searchFriend } from '../apiCalls';

const useFriend = (index, user_id, active, searchInput) => {
    const [friends, setfriend] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [error, seterror] = useState(null);
    const [hasMore, sethasMore] = useState(true);
    
    useEffect(() => {
        setisLoading(true);
        seterror(null);
        active ? searchFriend(index, user_id, searchInput)
        .then(d =>{
            setfriend(prev => [...prev, ...d]);
            sethasMore(Boolean(d.length));
            setisLoading(false);
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
        }) :
        fetchFriend(index, user_id)
        .then(d => {
            setfriend(prev => [...prev, ...d]);
            sethasMore(Boolean(d.length === 15));
            setisLoading(false);
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

    }, [index]);

    useEffect(() => {
        sethasMore(true);
        setisLoading(true);
        seterror(null);
        active && searchFriend(null, user_id, searchInput)
        .then(d => {
            setfriend(d);
            setisLoading(false);
        }).catch(e =>{
            if(!e?.response){
                seterror("No Sever Response");
            }else if(e.response?.data){
                seterror(e.response.data);
            }else{
                seterror("You are currently offline. Check your internet Connection!");
            };
            setisLoading(false);
        });    
    }, [searchInput, active, user_id]);

    return { friends, setfriend, isLoading, error, hasMore};
}

export default useFriend;
