import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../component/Header';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import { AuthContext } from '../../context/AuthContext';
import useMessage from '../../hooks/useMessage';
import './chat.css';
const API_URL = process.env.REACT_APP_API_URL;
export default function Chat() {
    const {user} = useContext(AuthContext);
    const [friend, setFriend] = useState({});
    const params = useParams();
    const [inputMsg, setinputMsg] = useState("");
    const chatBox = useRef();
    const [active, setActive] = useState(false);

    const scrollToBottom = useCallback(() =>{
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
    },[]);

    const { messages, isLoading, error} = useMessage(user.user_id, params.friend_id, active, scrollToBottom);
    
    useEffect(() => {
        const fetchUser = async () => {
            axios.get(`${API_URL}users/${params.friend_id}`).then(res =>{
                setFriend(res.data);
                scrollToBottom();
            }).catch(err => console.log(err));
        }
        fetchUser();
    }, [params.friend_id, scrollToBottom]);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        const msg =  {
            sender_id : user.user_id,
            receiver_id : friend.user_id,
            message : inputMsg
        }
        const sendMessage = async () =>{
            try{
                await axios.post(`${API_URL}messages/message`, msg);
                setinputMsg("");
            }catch(err){
                console.log(err);
            }
            scrollToBottom();
        }
        inputMsg && sendMessage();
    }

   
 
    return (
        <div className="wrapper">
            <section className="chat-area">
                <Header user={friend} logUserId={user.user_id} isEmpty={Boolean(messages.length)} />
                
                <div className="chat-box" ref={chatBox} onMouseEnter={() => setActive(true)} onMouseOut={() => setActive(false)} >
                    {error && <div className="error-txt">{error}</div>}
                   {messages.length!==0 ? messages.map((msg) => (msg.sender_id===user.user_id ?
                        <Outgoing key={msg.id} msg={msg.message} /> : 
                        <Incoming key={msg.id} msg={msg.message} profil_pic={friend.profil_pic} /> )
                    ) : <div className="empty-chat">
                            No messages are available. Once you send message they will appear here.
                        </div>}
                        
                        {isLoading && <div className="loading-wrap">
                        <CircularProgress  style={{color: "#c2c2c9", width: "30px", height: "30px"}}/>
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
