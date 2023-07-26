// import { CircularProgress } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getFriend, readAllMessages } from '../../apiCalls';
import Header from '../../component/Header';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import { AuthContext } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useMessage from '../../hooks/useMessage';
import io from "socket.io-client";
import './chat.css';

const API_URL = process.env.REACT_APP_API_SOCKET_URL;

export default function Chat() {
    const {user, dispatch} = useContext(AuthContext);
    const [friend, setFriend] = useState({});
    const params = useParams();
    const [inputMsg, setinputMsg] = useState("");
    const chatBox = useRef(null);
    const socket = useRef(null);
    const axiosPrivate = useAxiosPrivate();
    const [isMount, setisMount] = useState(true);

    const scrollToBottom = useCallback(() =>{
        chatBox.current.scrollTop = chatBox?.current.scrollHeight;
    },[]);

    const { messages, setMessages, error } = useMessage(params.friend_id, scrollToBottom);

    useEffect(() => {
        readAllMessages(axiosPrivate, params.friend_id);
    }, [axiosPrivate, params.friend_id, messages]);
    
    useEffect(() => {
        getFriend(axiosPrivate, params.friend_id, dispatch).then(res =>{
            res && setFriend(res);
            scrollToBottom();
        });
    }, [params.friend_id, scrollToBottom, axiosPrivate, dispatch]);

    useEffect(() => {
        socket.current = io.connect(API_URL);
        socket?.current.on('connect', () =>{
            socket?.current.emit("joinRoom", user.user_id+Number(params.friend_id));
            socket?.current?.on("getMessage", data => {
                isMount && setMessages(prev => [...prev, data]);
            });
        });
        socket?.current.on('error', (error) => {
            socket.current?.off();
            socket?.current.disconnect();
        });
        return () =>{
            setisMount(false);
            socket?.current.emit("leaveRoom", user.user_id+Number(params.friend_id));
            socket.current?.off();
            socket?.current.disconnect();
        };
    }, [user, params.friend_id, isMount, setMessages]);

     useEffect(() => {
         scrollToBottom();
     }, [messages, scrollToBottom]);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        const msg =  {
            sender_id : user.user_id,
            receiver_id : friend.user_id,
            message : inputMsg
        }
        // if(inputMsg.match(/^[\da-fA-F]{4,5}$/)){
        //     let emoji = inputMsg.padStart(5,'O');
        //     emoji = String.fromCharCode(parseInt(emoji, 16));
        //     msg.message = emoji;
        // }
        const sendMessage = async () =>{
            socket?.current.emit("sendMessage", msg);
            try{
                setMessages(prev => [...prev, msg]);
                setinputMsg("");
                await axiosPrivate.post(`messages/message`, JSON.stringify(msg));
            }catch(err){
            }
        }
        inputMsg && sendMessage();
    }

   
 
    return (
        <div className="wrapper">
            <section className="chat-area">
                <Header user={friend} logUserId={user.user_id} setMessages={setMessages} isEmpty={Boolean(messages.length)} />
                
                <div className="chat-box" ref={chatBox} >
                    {error && <div className="error-txt">{error}</div>}
                   {messages.length!==0 ? messages.map((msg, index) => (msg.sender_id===user.user_id ?
                        <Outgoing key={index} msg={msg.message} /> : 
                        <Incoming key={index} msg={msg.message} profil_pic={friend.profil_pic} /> )
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
