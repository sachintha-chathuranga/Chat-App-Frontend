import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { memo } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Friend = ({friend}) => {
    const {user} = useContext(AuthContext);
    const [msg, setMsg] = useState({});
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getLastMsg = async () =>{
            axiosPrivate.get(`messages/msg?friend_id=${friend.user_id}`).then(res =>{
                setMsg(res.data);
            }).catch(err => console.log(err));
        }
        getLastMsg();
    }, [friend.user_id, user.user_id, axiosPrivate]);


    return (
        <Link to={"/chat/"+friend.user_id} style={{textDecoration:"none"}} >
            <div className="friend">
                <div className="content">
                    <img src={friend.profil_pic ? imageUrl+friend.profil_pic : PF+"default.png"} alt="proPic" />
                    <div className="details">
                        <span>{friend.fname+ " "+friend.lname}</span>
                        <p>{msg.message}</p>
                    </div>
                </div>
                <div className={friend.status ? "status-dot" : "status-dot offline"}><i className="fas fa-circle"></i></div>
            </div>
        </Link>
    )
}

export default memo(Friend);
