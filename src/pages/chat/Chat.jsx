import {FlashOnRounded, Telegram} from '@mui/icons-material';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getFriend, readAllMessages} from '../../apiCalls';
import Header from '../../component/Header/Header';
import Incoming from '../../component/Incoming';
import Outgoing from '../../component/Outgoing';
import {useAuth} from '../../context/AuthContext/AuthContext';
import {useSocket} from '../../context/SocketContext/SocketContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useMessage from '../../hooks/useMessage';
import './chat.css';

const skeletonMessages = [
	{type: 1, id: 1},
	{type: 2, id: 2},
	{type: 1, id: 3},
	{type: 1, id: 4},
	{type: 2, id: 5},
];

export default function Chat() {
	console.log('chat render');
	const {user} = useAuth();
	const {socket, isConnected} = useSocket();
	const [friend, setFriend] = useState({});
	const params = useParams();
	const [inputMsg, setinputMsg] = useState('');
	const chatBox = useRef(null);
	const privateApi = useAxiosPrivate();
	const [isFriendFetching, setIsFriendFetching] = useState(FlashOnRounded);

	const scrollToBottom = useCallback(() => {
		if (chatBox.current) {
			chatBox.current.scrollTop = chatBox?.current?.scrollHeight;
		}
	}, []);

	const {messages, setMessages, error, isMessageFetching} = useMessage(params.friend_id, scrollToBottom);

	useEffect(() => {
		readAllMessages(privateApi, params.friend_id);
	}, [privateApi, params.friend_id, messages]);

	useEffect(() => {
		setIsFriendFetching(true);
		getFriend(privateApi, params.friend_id).then((res) => {
			setIsFriendFetching(false);
			res && setFriend(res);
			scrollToBottom();
		});
		// eslint-disable-next-line
	}, [params.friend_id, scrollToBottom]);

	useEffect(() => {
		if (!socket || !isConnected) return;
		const handleMessage = (data) => {
			if (data.sender_id === friend.user_id) {
				setMessages((prev) => [...prev, data]);
			}
		};
		console.log('ChatScreen listning for messages...');
		socket.on('getMessage', handleMessage);

		return () => {
			console.log('ChatScreen listener Off');
			socket.off('getMessage', handleMessage);
		};
		// eslint-disable-next-line
	}, [socket, friend.user_id, isConnected]);

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
				const res = await privateApi.post(`messages/message`, JSON.stringify(msg));
				socket?.emit('sendMessage', res.data);
				setMessages((prev) => [...prev, res.data]);
				setinputMsg('');
			} catch (err) {
				console.log(err);
			}
		};
		inputMsg && sendMessage();
	};

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
									<Outgoing key={msg.id} msg={msg.message} />
								) : (
									<Incoming key={msg.id} msg={msg.message} profil_pic={friend.profil_pic} />
								)
							)
						) : (
							<div className="empty-chat">
								No messages are available. Once you send message they will appear here.
							</div>
						)
					) : (
						skeletonMessages.map((msg, index) =>
							msg.type === 2 ? (
								<Outgoing isLoading={isMessageFetching} key={msg.id} />
							) : (
								<Incoming isLoading={isMessageFetching} key={msg.id} />
							)
						)
					)}
				</div>
				<form onSubmit={handleSubmit} className="typing-area" autoComplete="off">
					<input
						type="text"
						value={inputMsg}
						onChange={(e) => setinputMsg(e.target.value)}
						className="input-field"
						placeholder="Type a message here..."
					/>
					<button className="message-btn" type="submit">
						<Telegram />
					</button>
				</form>
			</section>
		</div>
	);
}
