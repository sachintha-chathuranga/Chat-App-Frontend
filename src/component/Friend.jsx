import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { memo } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Friend = ({notifi, friend}) => {
    const [msg, setMsg] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const [notification, setNotification] = useState([]);
    const [isMount, setisMount] = useState(true);

    useEffect(() => {
        setNotification(notifi.filter(obj => obj.sender_id===friend.user_id));
    }, [notifi, friend])
    
    useEffect(() => {
        const getLastMsg = async () =>{
            axiosPrivate.get(`messages/msg?friend_id=${friend.user_id}`).then(res =>{
                isMount && setMsg(res.data);
            }).catch(err => console.log(err));
        }
        getLastMsg() ;
        return setisMount(false);
    }, [friend.user_id, axiosPrivate, isMount]);


    return (
        <Link to={"/chat/"+friend.user_id} style={{textDecoration:"none"}} >
            <div className="friend">
                <div className="content">
                    <img src={friend.profil_pic ? imageUrl+friend.profil_pic : PF+"default.png"} alt="proPic" />
                    {notification.length!==0 && <span className="notification">{notification.length }</span>}
                    <div className="details">
                        <span>{friend.fname+ " "+friend.lname}</span>
                        <p>{notification.length===0 ? msg.message : notification[notification.length - 1].message}</p>
                    </div>
                </div>
                <div className={friend.status ? "status-dot" : "status-dot offline"}><i className="fas fa-circle"></i></div>
            </div>
        </Link>
    )
}

export default memo(Friend);
