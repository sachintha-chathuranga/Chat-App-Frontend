import { CircularProgress } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getFriend } from '../../apiCalls';
import Header from '../../component/Header';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import { AuthContext } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useMessage from '../../hooks/useMessage';
import './chat.css';

export default function Chat() {
    const {user, dispatch} = useContext(AuthContext);
    const [friend, setFriend] = useState({});
    const params = useParams();
    const [inputMsg, setinputMsg] = useState("");
    const chatBox = useRef();
    const [active, setActive] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [isFetching, setisFetching] = useState(false);

    const scrollToBottom = useCallback(() =>{
        chatBox.current.scrollTop = chatBox.current.scrollHeight;
    },[]);

    const { messages, error } = useMessage(params.friend_id, active, scrollToBottom);
    
    useEffect(() => {
        getFriend(axiosPrivate, params.friend_id, dispatch).then(res =>{
            res.fname && setFriend(res);
            scrollToBottom();
        });
    }, [params.friend_id, scrollToBottom, axiosPrivate, dispatch]);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        const msg =  {
            sender_id : user.user_id,
            receiver_id : friend.user_id,
            message : inputMsg
        }
        const sendMessage = async () =>{
            setisFetching(true);
            try{
                await axiosPrivate.post(`messages/message`, msg);
                setisFetching(false);
                setinputMsg("");
            }catch(err){
                setisFetching(false);
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
                </div>
                <form onSubmit={handleSubmit} className="typing-area" autoComplete="off">
                    <input type="text" value={inputMsg} onChange={(e) => setinputMsg(e.target.value)} className="input-field" placeholder="Type a message here..." />
                    <button type="submit" disabled={isFetching} >{isFetching ? <CircularProgress style={{color: "white", width: "15px", height: "15px"}} /> : <i className="fab fa-telegram-plane"></i>}</button>
                </form>
            </section>
        </div>
    )
}
