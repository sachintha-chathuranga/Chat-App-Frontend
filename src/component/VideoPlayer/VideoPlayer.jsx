import React, {memo, useEffect, useState} from 'react';

import {useVideoCall} from '../../context/VideoCallContext/VideoCallContext';
import './videoPlayer.css';

const VideoPlayer = () => {
	console.log('Video Player render');
	const {userVideo, friendVideo, stream, remoteStream} = useVideoCall();
	const [isUserFullscreen, setIsUserFullscreen] = useState(false);

	useEffect(() => {
		if (userVideo.current && stream) {
			console.log('Set srcObject to user');
			userVideo.current.srcObject = stream;
		}
		// eslint-disable-next-line
	}, [stream]);
	useEffect(() => {
		if (friendVideo.current && remoteStream) {
			console.log('Set srcObject to friend');
			friendVideo.current.srcObject = remoteStream;
		}
		// eslint-disable-next-line
	}, [remoteStream]);

	const toggleUserScreen = (isUser) => {
		if (isUser && !isUserFullscreen) {
			setIsUserFullscreen((prev) => !prev);
		} else if (!isUser && isUserFullscreen) {
			setIsUserFullscreen((prev) => !prev);
		}
	};

	return (
		<div className="video-wrapper">
			{/* {remoteStream && ( */}
			<div
				onClick={() => toggleUserScreen(false)}
				className={`video-container ${!isUserFullscreen ? 'main-screen' : 'sub-screen'}`}
			>
				<video playsInline src="" ref={friendVideo} autoPlay></video>
			</div>
			<div
				onClick={() => toggleUserScreen(true)}
				className={`video-container ${isUserFullscreen ? 'main-screen' : 'sub-screen'}`}
			>
				<video playsInline muted src="" ref={userVideo} autoPlay />
			</div>
			{/* )} */}

			{/* {stream && ( */}
			{/* )} */}
		</div>
	);
};

export default memo(VideoPlayer);
