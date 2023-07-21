import { useState, useEffect } from 'react';
import { fetchFriend, searchFriend } from '../apiCalls';
import useAxiosPrivate from './useAxiosPrivate';

const useFriend = (index, active, searchInput) => {
    const [friends, setfriend] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [error, seterror] = useState(null);
    const [hasMore, sethasMore] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
        setisLoading(true);
        active ? searchFriend(axiosPrivate, index, searchInput)
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
        fetchFriend(axiosPrivate, index)
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
        setisLoading(true);
        active ? searchFriend(axiosPrivate, null, searchInput)
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
        }) :
        fetchFriend(axiosPrivate, null)
        .then(d => {
                setfriend(d);
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

    }, [searchInput, active, axiosPrivate]);

    return { friends, setfriend, isLoading, error, hasMore};
}

export default useFriend;
