import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import Peer from 'simple-peer';
import {io} from 'socket.io-client';
import {AuthContext} from '../AuthContext/AuthContext';
const API_URL = process.env.REACT_APP_API_SOCKET_URL;

const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
	console.log('Socket Context render');

	const {user} = useContext(AuthContext);
	const [socket, setSocket] = useState(null);
	const userVideo = useRef();
	const friendVideo = useRef();
	const connectionRef = useRef();
	const [call, setCall] = useState({});
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [stream, setStream] = useState(null);
	const connectSocket = useCallback((userId) => {
		if (!socket) {
			const newSocket = io(API_URL);
			newSocket.on('connect', () => {
				console.log('Socket Connected');
				newSocket?.emit('joinRoom', userId);
			});
			newSocket.on('disconnect', () => {
				console.log('Socket disconnected');
			});
			newSocket.on('error', (error) => {
				console.error('Socket error:', error);
			});
			setSocket(newSocket);
		}
		// eslint-disable-next-line
	}, [socket]);
	const disconnectSocket = useCallback(() => {
		if (socket) {
			socket.emit('leaveRoom', user?.user_id);
			socket.disconnect();
			setSocket(null);
		}
		// eslint-disable-next-line
	}, [socket, user?.user_id]);

	useEffect(() => {
		if (user?.user_id) {
			connectSocket(user?.user_id);
		}
	}, [user?.user_id,connectSocket]);

	useEffect(() => {
		if (!socket || !user) return;

		socket.on('calluser', ({from, signal}) => {
			setCall({isReceivedCall: true, from, signal});
			answerCall(from, signal);
		});

		return () => {
			console.log('Context unmounted');
			socket.off('calluser');
		};
		// eslint-disable-next-line
	}, [user?.user_id]);
	useEffect(() => {
		if (userVideo.current && stream) {
			userVideo.current.srcObject = stream;
		}
	}, [stream]);

	const callUser = (id) => {
		const peer = new Peer({initiator: true, trickle: false, stream});
		peer.on('signal', (data) => {
			socket.emit('calluser', {userToCall: parseInt(id), signalData: data, from: parseInt(user.user_id)});
		});
		peer.on('stream', (currentStream) => {
			console.log('stream from callUser');
			if (friendVideo.current) {
				friendVideo.current.srcObject = currentStream;
			}
		});
		socket.once('callaccepted', (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});
		connectionRef.current = peer;
	};
	const answerCall = (from, signal) => {
		setCallAccepted(true);
		const peer = new Peer({initiator: false, trickle: false, stream});
		peer.on('signal', (data) => {
			socket.emit('answercall', {signal: data, to: from});
		});
		peer.on('stream', (currentStream) => {
			console.log('stream from answerCall');
			if (friendVideo.current) {
				friendVideo.current.srcObject = currentStream;
			}
		});
		peer.signal(signal);

		connectionRef.current = peer;
	};

	const leaveCall = () => {
		console.log('leave Call');
		setCallEnded(true);
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		if (connectionRef.current) {
			// connectionRef.current.removeAllListeners();
			connectionRef.current = null;
		}
		if (friendVideo.current) {
			friendVideo.current.srcObject = null;
		}
		if (userVideo.current) {
			userVideo.current.srcObject = null;
		}

		socket.off('callaccepted');
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				connectSocket,
				disconnectSocket,
				userVideo,
				friendVideo,
				stream,
				setStream,
				callAccepted,
				callUser,
				callEnded,
				call,
				leaveCall,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
