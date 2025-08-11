import {Telegram, VideocamOffRounded, VideocamRounded} from '@mui/icons-material';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getFriend, readAllMessages} from '../../apiCalls';
import Header from '../../component/Header/Header';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import {AuthContext} from '../../context/AuthContext/AuthContext';
import {useSocket} from '../../context/SocketContext/SocketContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useMessage from '../../hooks/useMessage';
import './chat.css';

export default function Chat() {
	console.log('chat render');
	const {socket} = useSocket();
	const {user, dispatch} = useContext(AuthContext);
	const [friend, setFriend] = useState({});
	const params = useParams();
	const [inputMsg, setinputMsg] = useState('');
	const chatBox = useRef(null);
	const axiosPrivate = useAxiosPrivate();
	const [isFriendFetching, setIsFriendFetching] = useState(false);
	const skeletonMessages = [1, 2, 1, 1, 2];
	const [isTurnOnCamera, setIsTurnOnCamera] = useState(false);

	const scrollToBottom = useCallback(() => {
		chatBox.current.scrollTop = chatBox?.current?.scrollHeight;
	}, []);

	const {messages, setMessages, error, isMessageFetching} = useMessage(params.friend_id, scrollToBottom);

	useEffect(() => {
		readAllMessages(axiosPrivate, params.friend_id);
	}, [axiosPrivate, params.friend_id, messages]);

	useEffect(() => {
		setIsFriendFetching(true);
		getFriend(axiosPrivate, params.friend_id, dispatch).then((res) => {
			setIsFriendFetching(false);
			res && setFriend(res);
			scrollToBottom();
		});
	}, [params.friend_id, scrollToBottom, axiosPrivate, dispatch]);

	useEffect(() => {
		if (!socket) return;
		socket.on('getMessage', (data) => {
			if (data.sender_id === friend.user_id) {
				setMessages((prev) => [...prev, data]);
			}
		});

		return () => {
			socket.off('getMessage');
		};
		
	}, [socket,setMessages,friend.user_id]);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const msg = {
			sender_id: user.user_id,
			receiver_id: friend.user_id,
			message: inputMsg,
			createdAt: Date.now(),
		};
		// if(inputMsg.match(/^[\da-fA-F]{4,5}$/)){
		//     let emoji = inputMsg.padStart(5,'O');
		//     emoji = String.fromCharCode(parseInt(emoji, 16));
		//     msg.message = emoji;
		// }
		const sendMessage = async () => {
			try {
				await axiosPrivate.post(`messages/message`, JSON.stringify(msg));
				socket?.emit('sendMessage', msg);
				setMessages((prev) => [...prev, msg]);
				setinputMsg('');
			} catch (err) {
				console.log(err);
			}
		};
		inputMsg && sendMessage();
	};

	const toggleCamera = useCallback(() => {
		setIsTurnOnCamera(!isTurnOnCamera);
	}, [isTurnOnCamera]);

	return (
		<div className="wrapper">
			<section className="chat-area">
				<Header
					user={friend}
					logUserId={user.user_id}
					setMessages={setMessages}
					isEmpty={Boolean(messages.length)}
					headerType={'chat'}
					isFriendFetching={isFriendFetching}
				/>

				<div className="chat-box" ref={chatBox}>
					{error && <div className="error-txt">{error}</div>}
					{!isMessageFetching ? (
						messages.length !== 0 ? (
							messages.map((msg, index) =>
								msg.sender_id === user.user_id ? (
									<Outgoing key={index} msg={msg.message} />
								) : (
									<Incoming key={index} msg={msg.message} profil_pic={friend.profil_pic} />
								)
							)
						) : (
							<div className="empty-chat">
								No messages are available. Once you send message they will appear here.
							</div>
						)
					) : (
						skeletonMessages.map((msg, index) =>
							msg === 2 ? (
								<Outgoing isLoading={isMessageFetching} key={index} />
							) : (
								<Incoming isLoading={isMessageFetching} key={index} />
							)
						)
					)}

					{/* <VideoPlayer
						friendId={friend.user_id}
						isTurnOnCamera={isTurnOnCamera}
						setIsTurnOnCamera={setIsTurnOnCamera}
					/> */}
				</div>
				<form onSubmit={handleSubmit} className="typing-area" autoComplete="off">
					<input
						type="text"
						value={inputMsg}
						onChange={(e) => setinputMsg(e.target.value)}
						className="input-field"
						placeholder="Type a message here..."
					/>
					<button type="submit">
						<Telegram />
					</button>
					{friend.status && (
						<div className="video-call-btn" onClick={toggleCamera}>
							{isTurnOnCamera ? (
								<VideocamOffRounded fontSize="large"></VideocamOffRounded>
							) : (
								<VideocamRounded fontSize="large"></VideocamRounded>
							)}
						</div>
					)}
				</form>
			</section>
		</div>
	);
}
