import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import { AuthContext } from '../../context/AuthContext';
import './chat.css';
const API_URL = process.env.REACT_APP_API_URL;
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

export default function Chat() {

    const {user} = useContext(AuthContext);
    const [friend, setFriend] = useState({});
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const params = useParams();
    const [inputMsg, setinputMsg] = useState("");
    const [active, setActive] = useState(false);
    const chatBox = useRef();

    //when cuser point inside the chat area auto scroll bottom is deactivate.
    const handleMousSeenter = ()=>{
        setActive(true);
    }
    const handleMouseLeave = ()=>{
        setActive(false);
    }
    
    useEffect(() => {
        
        const fetchUser = async () => {
            axios.get(`${API_URL}${params.friend_id}`).then(res =>{
                setFriend(res.data);
            }).catch(err => console.log(err));
        }
        const fetchMessage = async () =>{
            axios.get(`${API_URL}message?user_id=${user.user_id}&friend_id=${params.friend_id}`).then(res =>{
                setMessages(res.data);
            }).catch(err => console.log(err));
        }
        const interval = setInterval(() => {
                !active && scrollToBottom();
            fetchMessage();
        }, 500);
        fetchUser();
        return () => clearInterval(interval);
    }, [params.friend_id, user.user_id, active]);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        const msg =  {
            sender_id : user.user_id,
            receiver_id : friend.user_id,
            message : inputMsg
        }
        const sendMessage = async () =>{
            try{
                await axios.post(`${API_URL}message`, msg);
                setinputMsg("");
            }catch(err){
                console.log(err);
            }
        }
        inputMsg && sendMessage();
        scrollToBottom();
    }

    const scrollToBottom = () =>{
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
 
    return (
        <div className="wrapper">
            <section className="chat-area">
                <header>
                    <div className="back-icon" onClick={() => history.goBack() }><i className="fas fa-arrow-left"></i></div>
                    <img src={friend.profil_pic ? imageUrl+friend.profil_pic : PF+"default.png"} alt="pro" />
                    <div className="details">
                        <span>{friend.fname + " " + friend.lname}</span>
                        <p>{friend.status ? "Online" : "Offline"}</p>
                    </div>
                </header>
                <div className="chat-box" ref={chatBox} onMouseEnter={handleMousSeenter} onMouseLeave={handleMouseLeave} >
                   {messages.length!==0 ? messages.map((msg) => (msg.sender_id===user.user_id ?
                        <Outgoing key={msg.id} msg={msg.message} /> : 
                        <Incoming key={msg.id} msg={msg.message} profil_pic={friend.profil_pic} /> )
                    ) : <div className="empty-chat">
                            No messages are available. Once you send message they will appear here.
                        </div>}
                </div>
                <form onSubmit={handleSubmit} className="typing-area" autoComplete="off">
                    <input type="text" value={inputMsg} onChange={(e) => setinputMsg(e.target.value)} className="input-field" placeholder="Type a message here..." />
                    <button type="submit" ><i className="fab fa-telegram-plane"></i></button>
                </form>
            </section>
        </div>
    )
}
