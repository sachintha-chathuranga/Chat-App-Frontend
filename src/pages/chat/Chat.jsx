// import { CircularProgress } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getFriend } from '../../apiCalls';
import Header from '../../component/Header';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import { AuthContext } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useMessage from '../../hooks/useMessage';
import io from "socket.io-client";
import './chat.css';


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
        getFriend(axiosPrivate, params.friend_id, dispatch).then(res =>{
            res.fname && setFriend(res);
            scrollToBottom();
        });
    }, [params.friend_id, scrollToBottom, axiosPrivate, dispatch]);

    useEffect(() => {
        socket.current = io.connect("http://localhost:5000/");
        socket?.current.on('connect', () =>{
            console.log('connected');
            socket?.current.emit("joinRoom", user.user_id+Number(params.friend_id));
            socket?.current?.on("getMessage", data => {
                isMount && setMessages(prev => [...prev, data]);
            });
        });
        socket?.current.on('error', (error) => {
            console.log(error);
        });
        return () =>{
            setisMount(false);
            socket?.current.emit("leaveRoom", user.user_id+Number(params.friend_id));
            socket?.current.disconnect();
        };
    }, [user]);

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
        socket?.current.emit("sendMessage", msg);
        // socket?.current.emit("sendMessage", msg);
        const sendMessage = async () =>{
            try{
                setMessages(prev => [...prev, msg]);
                await axiosPrivate.post(`messages/message`, msg);
                setinputMsg("");
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
