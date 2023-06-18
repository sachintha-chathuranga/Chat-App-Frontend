import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

export default function Friend({friend}) {
    const {user} = useContext(AuthContext);
    const [msg, setMsg] = useState({});
    
    useEffect(() => {
        const getLastMsg = async () =>{
            axios.get(`${API_URL}msg?user_id=${user.user_id}&friend_id=${friend.user_id}`).then(res =>{
                setMsg(res.data);
            }).catch(err => console.log(err));
        }
        getLastMsg();
    }, [friend.user_id, user.user_id]);

    return (
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
    )
}
