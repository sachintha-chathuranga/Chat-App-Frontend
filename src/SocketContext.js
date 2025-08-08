import {createContext, useEffect, useRef, useState} from 'react';
import Peer from 'simple-peer';
import {io} from 'socket.io-client';
const API_URL = process.env.REACT_APP_API_SOCKET_URL;

const SocketContext = createContext();

const ContextProvider = ({children}) => {
	const socket = io(API_URL);
	console.log("SocketContext get render")
	const [stream, setStream] = useState(null);
	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();
	const [me, setMe] = useState('');
	const [call, setCall] = useState({});
	const [name, setName] = useState('');
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			console.log('Available devices:', devices);
		});
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then((currentStream) => {
				setStream(currentStream);
			})
			.catch((err) => {
				if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
					console.warn('No camera or microphone found.');
				} else if (err.name === 'NotAllowedError') {
					console.warn('Permissions denied.');
				} else {
					console.error('Error accessing media devices:', err);
				}
			});

		socket.on('me', (id) => setMe((prev) => (prev = id)));
		socket.on('calluser', ({from, name: callerName, signal}) => {
			setCall({isReceivedCall: true, from, name: callerName, signal});
		});

		// return () => {
		// 	second;
		// };
		// eslint-disable-next-line
	}, []);
	useEffect(() => {
		if (myVideo.current && stream) {
			myVideo.current.srcObject = stream;
		}
	}, [stream]);

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new Peer({initiator: false, trickle: false, stream});
		peer.on('signal', (data) => {
			socket.emit('answercall', {signal: data, to: call.from});
		});
		peer.on('stream', (currentStream) => {
			userVideo.current.srcObject = currentStream;
		});
		peer.signal(call.signal);
		connectionRef.current = peer;
	};
	const callUser = (id) => {
		const peer = new Peer({initiator: true, trickle: false, stream});
		peer.on('signal', (data) => {
			socket.emit('calluser', {userToCall: id, signalData: data, from: me, name});
		});
		peer.on('stream', (currentStream) => {
			userVideo.current.srcObject = currentStream;
		});
		socket.once('callaccepted', (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});
		connectionRef.current = peer;
	};
	const leaveCall = () => {
		console.log('leave Call');
		setCallEnded(true);
		socket.off('callaccepted');
		if (connectionRef.current) {
			connectionRef.current.destroy();
		}
		connectionRef.current.destroy();
		if (userVideo.current) {
			userVideo.current.srcObject = null;
		}

		// window.location.reload();
	};

	return (
		<SocketContext.Provider
			value={{
				call,
				callAccepted,
				myVideo,
				userVideo,
				stream,
				name,
				setName,
				callEnded,
				me,
				callUser,
				leaveCall,
				answerCall,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export {ContextProvider, SocketContext};
