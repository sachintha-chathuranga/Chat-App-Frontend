import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from '../../context/AuthContext';
import './chat.css';
const API_URL = process.env.REACT_APP_API_URL;
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

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
    }, [params.friend_id, user.user_id]);
    
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
                    <a className="back-icon" onClick={() => history.goBack() }><i className="fas fa-arrow-left">icon</i></a>
                    <img src={PF + friend.profil_pic} />
                    <div className="details">
                        <span>{friend.fname + " " + friend.lname}</span>
                        <p>{friend.status ? "Online" : "Offline"}</p>
                    </div>
                </header>
                <div className="chat-box" ref={chatBox} onmouseenter={handleMousSeenter} onmouseleave={handleMouseLeave} >
                   {messages.length!==0 ? messages.map((msg) => (msg.sender_id===user.user_id ?
                        <div className="chat outgoing"><div className="details"><p>{msg.message}</p></div></div> : 
                        <div className="chat incoming"><img src={PF+friend.profil_pic} alt="" /><div className="details"><p>{msg.message}</p></div></div>)
                    ) : <div style={{display: 'flex', alignItems: 'center',textAlign: 'center',height: '500px',overflowY: 'auto',background: '#f7f7f7',color: '#8a8a8a'}}>
                            No messages are available. Once you send message they will appear here.
                        </div>}
                </div>
                <form onSubmit={handleSubmit} className="typing-area" autoComplete="off">
                    <input type="text" value={inputMsg} onChange={(e) => setinputMsg(e.target.value)} className="input-field" placeholder="Type a message here..." />
                    <button type="submit" ><i className="fab fa-telegram-plane">icon</i></button>
                </form>
            </section>
        </div>
    )
}
