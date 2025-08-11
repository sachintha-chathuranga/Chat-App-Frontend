import React, {useEffect, useRef, useState} from 'react';

import {useSocket} from '../../context/SocketContext/SocketContext';
import './videoPlayer.css';

const VideoPlayer = ({friendId, isTurnOnCamera}) => {
	const {stream, setStream, callUser, leaveCall} = useSocket();
	const [isUserFullscreen, setIsUserFullscreen] = useState(false);
	const [isFriendFullscreen, setIsFriendFullscreen] = useState(false);

	const userVideo = useRef();
	const friendVideo = useRef();
	useEffect(() => {
		if (isTurnOnCamera) {
			navigator.mediaDevices
				.getUserMedia({video: true, audio: true})
				.then((currentStream) => {
					setStream(currentStream);
					callUser(friendId);
				})
				.catch((err) => {
					navigator.mediaDevices
						.getUserMedia({video: false, audio: false})
						.then((currentStream) => {
							setStream(currentStream);
						})
						.catch((err) => {
							console.warn(err);
						});
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
				});
		} else {
			stream && leaveCall();
		}
		// eslint-disable-next-line
	}, [isTurnOnCamera]);

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
			{friendVideo && (
				<div
					className={`friend-video ${isFriendFullscreen ? 'fullscreen' : ''} ${
						isUserFullscreen ? 'user-active' : ''
					}`}
				>
					<video playsInline src="" onClick={toggleFriendScreen} ref={friendVideo} autoPlay className="video" />
				</div>
			)}

			<div
				className={`user-video ${isUserFullscreen ? 'fullscreen' : ''} ${
					isFriendFullscreen ? 'friend-active' : ''
				}`}
			>
				{userVideo && isTurnOnCamera && (
					<video playsInline muted src="" ref={userVideo} onClick={toggleUserScreen} autoPlay className="video" />
				)}
			</div>
		</div>
	);
};

export default VideoPlayer;
