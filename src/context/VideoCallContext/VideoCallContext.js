import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import Peer from 'simple-peer';
import {AuthContext} from '../AuthContext/AuthContext';
import {useSocket} from '../SocketContext/SocketContext';

const VideoCallContext = createContext();

export const VideoCallContextProvider = ({children}) => {
	console.log('VideoCall Context render');

	const {user} = useContext(AuthContext);
	const {socket} = useSocket();

	const userVideo = useRef();
	const friendVideo = useRef();
	const connectionRef = useRef();
	const [call, setCall] = useState({});
	const [incomingCall, setIncommingCall] = useState(false);
	const [isInVideoCall, setIsInVideoCall] = useState(false);
	const [stream, setStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);

	useEffect(() => {
		if (!socket) return;

		socket.on('calluser', ({from, signal}) => {
			console.log('incoming call...');
			setIncommingCall(true);
			setCall({isReceivedCall: true, user: from, signal});
		});
		socket.on('hangup', ({from}) => {
			console.log('hangup call');
			leaveCall('remote');
		});

		return () => {
			socket.off('calluser');
		};
		// eslint-disable-next-line
	}, [socket]);

	const getMeadiaStream = useCallback(async () => {
		if (stream) {
			return stream;
		}
		try {
			// const devices = await navigator.mediaDevices.enumerateDevices();
			// const videoDevices = devices.filter((device) => device.kind === 'videoinput');
			const localStream = await navigator.mediaDevices.getUserMedia({
				// video: {
				// 	width: {min: 640, ideal: 1280, max: 1920},
				// 	height: {min: 360, ideal: 720, max: 1080},
				// 	frameRate: {min: 16, ideal: 30, max: 30},
				// 	facingMode: videoDevices.length > 0 ? faceMode : undefined,
				// },
				audio: true,
				video: true,
			});
			setStream((prev) => (prev = localStream));

			return localStream;
		} catch (err) {
			if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
				alert('No camera or microphone found.');
				// setMediaDeviceError('No camera or microphone found!');
				console.warn('No camera or microphone found.');
				// setIsTurnOnCamera(false);
			} else if (err.name === 'NotAllowedError') {
				alert('Permissions denied for camera access.');
				// setMediaDeviceError('Permissions denied for camera access!');
				console.warn('Permissions denied for camera access.');
				// setIsTurnOnCamera(false);
			} else {
				alert('Permissions denied for camera access.');
				// setMediaDeviceError('Error accessing media devices!');
				console.error('Error accessing media devices:', err);
			}
			return null;
		}
	}, [stream]);

	const leaveCall = useCallback((type) => {
		if (type !== 'remote') {
			console.log('not a remote call')
			socket.emit('hangup', {to: call.user?.user_id, from: user?.user_id});
		}
		if (remoteStream) {
			remoteStream.getTracks().forEach((track) => track.stop());
			setRemoteStream(prev => prev=null);
		}
		if (connectionRef.current) {
			connectionRef.current.removeAllListeners('close');
			connectionRef.current = null;
		}
		if (friendVideo.current) {
			friendVideo.current.srcObject = null;
		}
		setIsInVideoCall((prev) => (prev = false));

		setIncommingCall((prev) => (prev = false));
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(prev => prev=null);
		
		}
		if (userVideo.current) {
			userVideo.current.srcObject = null;
		}

		socket.off('callaccepted');
	}, [socket, stream, call, user, remoteStream]);

	const callUser = useCallback(
		async (friend) => {
			const userStream = await getMeadiaStream();
			if (!userStream) return;
			// const iceServers = [
			// 	{
			// 		urls: ['stun:stun.1.google.com:19302', 'stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'],
			// 	},
			// ];
			const peer = new Peer({
				initiator: true,
				trickle: false,
				stream: userStream,
				//  config:[iceServers]
			});
			setCall({isReceivedCall: false, user: friend});
			setIsInVideoCall((prev) => (prev = true));
			peer.on('signal', (data) => {
				socket.emit('calluser', {userToCall: parseInt(friend.user_id), signalData: data, from: user});
			});
			peer.on('stream', (currentStream) => {
				console.log('stream from callUser');
				setRemoteStream((prev) => (prev = currentStream));
			});
			peer.on('close', () =>{ 
				console.log('peer close from caller end');
				leaveCall()});
			socket.once('callaccepted', ({signal, from}) => {
				setCall((prev) => ({...prev, signal}));
				peer.signal(signal);
			});
			connectionRef.current = peer;
		},
		[socket, getMeadiaStream, user, leaveCall]
	);

	const answerCall = useCallback(async () => {
		const userStream = await getMeadiaStream();
		if (!userStream) return;
		const peer = new Peer({initiator: false, trickle: false, stream: userStream});
		setIncommingCall(false);
		setIsInVideoCall(true);
		peer.on('signal', (data) => {
			socket.emit('answercall', {signal: data, from: user?.user_id, to: call.user.user_id});
		});
		peer.on('stream', (currentStream) => {
			setRemoteStream((prev) => (prev = currentStream));
		});
		peer.on('close', () => {
			console.log("peer close from receiver end")
			leaveCall()
		});
		peer.signal(call.signal);

		connectionRef.current = peer;
	}, [socket, call, getMeadiaStream, user.user_id]);

	return (
		<VideoCallContext.Provider
			value={{
				isInVideoCall,
				incomingCall,
				setIsInVideoCall,
				userVideo,
				friendVideo,
				stream,
				remoteStream,
				setStream,
				call,
				callUser,
				answerCall,
				leaveCall,
			}}
		>
			{children}
		</VideoCallContext.Provider>
	);
};

export const useVideoCall = () => useContext(VideoCallContext);
