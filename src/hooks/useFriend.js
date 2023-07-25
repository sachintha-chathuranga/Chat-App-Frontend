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
            console.log("first searrch with index run")
            setfriend(prev => [...prev, ...d]);
            sethasMore(Boolean(d.length));
            setisLoading(false);
        })
        .catch(e => {
            setisLoading(false);
            seterror(e.response);
        }) :
        fetchFriend(index, user_id)
        .then(d => {
            console.log("loading fetch freind run")
            setfriend(prev => [...prev, ...d]);
            sethasMore(Boolean(d.length === 15));
            setisLoading(false);
        })
        .catch(e => {
            setisLoading(false);
            seterror(e.response);
        });

    }, [index]);

    useEffect(() => {
        sethasMore(true);
        setisLoading(true);
        seterror(null);
        active && searchFriend(null, user_id, searchInput)
        .then(d => {
            console.log("second search with null running")
            setfriend(d);
            setisLoading(false);
        }).catch(e =>{
            setisLoading(false);
            seterror(e.response);
        });    
    }, [searchInput, active, user_id]);

    return { friends, setfriend, isLoading, error, hasMore};
}

export default useFriend;
