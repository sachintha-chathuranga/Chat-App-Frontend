import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import Peer from 'simple-peer';
import useRigingTone from '../../hooks/useRigingTone';
import {useAuth} from '../AuthContext/AuthContext';
import {useSocket} from '../SocketContext/SocketContext';

const VideoCallContext = createContext();

// const iceServers = [
// 	{
// 		urls: ['stun:stun.1.google.com:19302', 'stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'],
// 	},
// ];

const VideoCallContextProvider = ({children}) => {
	console.log('VideoCall Context render');

	const {user} = useAuth();
	const {socket} = useSocket();

	const userVideo = useRef();
	const friendVideo = useRef();
	const connectionRef = useRef();
	const [call, setCall] = useState({});
	const [incomingCall, setIncommingCall] = useState(false);
	const [outgoingCall, setOutgoingCall] = useState(false);
	const [isInVideoCall, setIsInVideoCall] = useState(false);
	const [isCallAccepted, setIsCallAccepted] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [stream, setStream] = useState(null);
	const [remoteStream, setRemoteStream] = useState(null);
	const {playincommingRingtone, stopIncommingRingtone, playOutgoingRingtone, stopOutgoingRingtone} = useRigingTone();

	useEffect(() => {
		if (incomingCall) {
			playincommingRingtone();
		} else {
			stopIncommingRingtone();
		}
		// eslint-disable-next-line
	}, [incomingCall]);

	useEffect(() => {
		if (outgoingCall) {
			playOutgoingRingtone();
		} else {
			stopOutgoingRingtone();
		}
		// eslint-disable-next-line
	}, [outgoingCall]);
	const leaveCall = useCallback(
		(type) => {
			if (type !== 'remote') {
				console.log('send hangup request to socket');
				socket.emit('hangup', {to: call.user?.user_id, from: user?.user_id});
			}
			console.log(call);
			console.log(isCallAccepted);
			if (!call.isReceivedCall) {
				if (!isCallAccepted) {
					setOutgoingCall(false);
				}
			}
			console.log(errorMessage)
			if (errorMessage) {
				setErrorMessage(prev => prev='')
			}

			if (remoteStream) {
				console.log('clear remote stream');
				remoteStream.getTracks().forEach((track) => track.stop());
				setRemoteStream((prev) => (prev = null));
			}
			if (friendVideo.current) {
				console.log('friends Video ref');
				friendVideo.current.srcObject = null;
			}
			if (stream) {
				console.log('clear my stream');
				stream.getTracks().forEach((track) => track.stop());
				setStream((prev) => (prev = null));
			}

			if (userVideo.current) {
				console.log('clear userVideo ref');
				userVideo.current.srcObject = null;
			}
			if (connectionRef.current) {
				connectionRef.current.removeAllListeners('stream');
				connectionRef.current.removeAllListeners('signal');
				connectionRef.current.destroy();
				connectionRef.current = null;
			}

			socket.off('callaccepted');
			setIsInVideoCall((prev) => (prev = false));
			setIncommingCall((prev) => (prev = false));
			setIsCallAccepted((prev) => (prev = false));
			setCall({});
		},
		[socket, stream, call, user, remoteStream, isCallAccepted, errorMessage]
	);

	useEffect(() => {
		if (!socket) return;
		console.log('calluser listner calling');
		socket.on('calluser', ({from, signal}) => {
			if (incomingCall || outgoingCall || isInVideoCall) {
				socket.emit('busycall', {to: from?.user_id, from: user});
				return;
			}
			console.log('incoming call from ', from.user_id);
			setIncommingCall((prev) => (prev = true));
			setCall((prev) => (prev = {isReceivedCall: true, user: from, signal}));
		});
		socket.on('hangup', ({from}) => {
			console.log('hangup call');
			leaveCall('remote');
		});

		return () => {
			socket.off('calluser');
			socket.off('hangup');
		};
	}, [socket, incomingCall,outgoingCall,isInVideoCall,leaveCall,user]);

	const rejectIncommingCall = useCallback(() => {
		setIncommingCall(false);
		setCall({});
		socket.emit('hangup', {to: call.user?.user_id, from: user?.user_id});
	}, [call.user?.user_id, user?.user_id, socket]);

	const getMeadiaStream = useCallback(
		async (faceMode) => {
			if (stream) {
				return stream;
			}
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter((device) => device.kind === 'videoinput');
				const localStream = await navigator.mediaDevices.getUserMedia({
					video: {
						width: {min: 640, ideal: 1280, max: 1920},
						height: {min: 360, ideal: 720, max: 1080},
						frameRate: {min: 16, ideal: 30, max: 30},
						facingMode: videoDevices.length > 0 ? faceMode : undefined,
					},
					audio: true,
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
					alert('Error accessing media devices.');
					// setMediaDeviceError('Error accessing media devices!');
					console.error('Error accessing media devices:', err);
				}
				return null;
			}
		},
		[stream]
	);


	const callUser = useCallback(
		async (friend, navigate) => {
			const userStream = await getMeadiaStream();
			if (!userStream) return;

			try {
				// connect with iceServers and get peer connection
				const peer = new Peer({
					initiator: true,
					trickle: false,
					stream: userStream,
					// config: [iceServers],
				});
				peer.on('signal', (data) => {
					setOutgoingCall((prev) => (prev = true));
					setCall({isReceivedCall: false, user: friend});
					// send caller iceserver signal to friend
					socket.emit('calluser', {userToCall: parseInt(friend.user_id), signalData: data, from: user});
				});
				// store friend's singnal in caller side iceservers
				socket.once('callaccepted', ({signal, from}) => {
					setCall((prev) => ({...prev, signal}));
					setIsInVideoCall((prev) => (prev = true));
					setIsCallAccepted((prev) => (prev = true));
					setOutgoingCall((prev) => (prev = false));
					navigate(`/video-call/${friend.user_id}`);
					peer.signal(signal);
				});
				socket.once('numberbusy', ({from}) => {
					setErrorMessage(`${from.fname} in another call!`)
					setOutgoingCall(prev => prev=false)
				});
				peer.on('stream', (currentStream) => {
					//whenever friend connect to the ice server, set the incomming friends video stream to caller side friendref
					setRemoteStream((prev) => (prev = currentStream));
				});

				peer.on('close', () => {
					console.log('peer connection close');
					leaveCall();
				});
				peer.on('error', (err) => {
					if (err.name === 'OperationError') {
						console.log('Peer closed, safe to ignore:', err);
					} else {
						console.error('Peer error:', err);
					}
				});

				connectionRef.current = peer;
			} catch (error) {
				console.error(error);
			}
		},
		[socket, getMeadiaStream, user, leaveCall]
	);

	const answerCall = useCallback(
		async (navigate) => {
			try {
				const userStream = await getMeadiaStream();
				if (!userStream) return;
				const peer = new Peer({
					initiator: false,
					trickle: false,
					stream: userStream,
					// config: [iceServers],
				});
				peer.on('signal', (data) => {
					setIncommingCall(false);
					setIsInVideoCall(true);
					setIsCallAccepted(true);
					socket.emit('answercall', {signal: data, from: user?.user_id, to: call.user?.user_id});
					navigate('/video-call/' + call.user?.user_id);
				});
				peer.on('stream', (currentStream) => {
					setRemoteStream((prev) => (prev = currentStream));
				});
				peer.on('error', (err) => {
					if (err.name === 'OperationError') {
						console.log('Peer closed, safe to ignore:', err);
					} else {
						console.error('Peer error:', err);
					}
				});
				peer.on('close', () => {
					console.log('peer connection closed');
					leaveCall();
				});

				peer.signal(call.signal);

				connectionRef.current = peer;
			} catch (error) {
				console.error(error);
			}
		},
		[socket, call, getMeadiaStream, user?.user_id, leaveCall]
	);

	return (
		<VideoCallContext.Provider
			value={{
				isInVideoCall,
				incomingCall,
				outgoingCall,
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
				rejectIncommingCall,
				errorMessage,
			}}
		>
			{children}
		</VideoCallContext.Provider>
	);
};

export const useVideoCall = () => useContext(VideoCallContext);

export const VideoCallProvider = VideoCallContextProvider;
