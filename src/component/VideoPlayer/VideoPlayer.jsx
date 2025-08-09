import React, {useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from '../../context/AuthContext/AuthContext';
import {SocketContext} from '../../context/SocketContext/SocketContext';
import './videoPlayer.css';
const VideoPlayer = () => {
	const {callAccepted, friendVideo, callEnded, call} = useContext(SocketContext);
	const [mediaDeviceError, setMediaDeviceError] = useState('');
	const [isUserFullscreen, setIsUserFullscreen] = useState(false);
	const [isFriendFullscreen, setIsFriendFullscreen] = useState(false);
	const {user} = useContext(AuthContext);
	const [stream, setStream] = useState(null);
	const userVideo = useRef();
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({video: true, audio: true})
			.then((currentStream) => {
				setStream(currentStream);
			})
			.catch((err) => {
				if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
					setMediaDeviceError('No camera or microphone found!');
					console.warn('No camera or microphone found.');
				} else if (err.name === 'NotAllowedError') {
					setMediaDeviceError('Permissions denied for camera access!');
					console.warn('Permissions denied for camera access.');
				} else {
					setMediaDeviceError('Error accessing media devices!');
					console.error('Error accessing media devices:', err);
				}
			});
	}, []);

	useEffect(() => {
		if (userVideo.current && stream) {
			userVideo.current.srcObject = stream;
		}
	}, [stream]);
	const toggleUserScreen = () => {
		setIsUserFullscreen(!isUserFullscreen);
		setIsFriendFullscreen(false);
	};
	const toggleFriendScreen = () => {
		setIsFriendFullscreen(!isFriendFullscreen);
		setIsUserFullscreen(false);
	};
	return (
		<div className="video-container">
			{/* {callAccepted && !callEnded && ( */}
			<div
				className={`friend-video ${isFriendFullscreen ? 'fullscreen' : ''} ${
					isUserFullscreen ? 'user-active' : ''
				}`}
			>
				<video playsInline src="" muted onClick={toggleFriendScreen} ref={friendVideo} autoPlay className="video" />
			</div>
			{/* // )} */}

			<div
				className={`user-video ${isUserFullscreen ? 'fullscreen' : ''} ${
					isFriendFullscreen ? 'friend-active' : ''
				}`}
			>
				{mediaDeviceError ? (
					<div className="device-error">{mediaDeviceError}</div>
				) : (
					<video playsInline src="" ref={userVideo} onClick={toggleUserScreen} autoPlay className="video" />
				)}
			</div>
		</div>
	);
};

export default VideoPlayer;
