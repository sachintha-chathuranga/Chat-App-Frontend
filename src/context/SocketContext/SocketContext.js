import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {AuthContext} from '../AuthContext/AuthContext';
const API_URL = process.env.REACT_APP_API_SOCKET_URL;

const SocketContext = createContext();

const SocketContextProvider = ({children}) => {
	const {user} = useContext(AuthContext);
	const socket = useRef(null);
	const [socketMsg, setSocketMsg] = useState(null);


	
	const friendVideo = useRef();
	const connectionRef = useRef();
	const [me, setMe] = useState('');
	const [call, setCall] = useState({});
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);

	console.log('Socket Context render');
	useEffect(() => {
		if (user && !socket.current) {
			socket.current = io(API_URL);

			socket?.current.on('connect', () => {
				console.log('User connected on Context');
				socket?.current.emit('joinRoom', user.user_id);
			});

			socket?.current?.on('getMessage', (data) => {
				setSocketMsg(data);
			});

			socket?.current.on('error', (error) => {
				console.error('Socket error:', error);
			});
			socket.current.on('disconnect', () => {
				console.log('Socket disconnected');
			});
		}
		return () => {
			console.log('Context unmounted');
			socket.current?.off('getMessage');
			socket?.current?.emit('leaveRoom', user.user_id);
			socket?.current?.disconnect();
			socket.current = null;
		};
		// eslint-disable-next-line
	}, [user?.user_id]);
	const sendSocketMessage = useCallback((msg) => {
		socket?.current?.emit('sendMessage', msg);
	}, []);

	return (
		<SocketContext.Provider
			value={{
				socketMsg,
				sendSocketMessage,
				setSocketMsg,
				callAccepted,
				friendVideo,
				callEnded,
				call,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export {SocketContext, SocketContextProvider};
