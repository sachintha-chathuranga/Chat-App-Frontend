import React, {useEffect, useState} from 'react';

import {useVideoCall} from '../../context/VideoCallContext/VideoCallContext';
import './videoPlayer.css';

const VideoPlayer = ({friendId}) => {
	const {userVideo, friendVideo, stream, remoteStream} = useVideoCall();
	const [isUserFullscreen, setIsUserFullscreen] = useState(false);
	const [isFriendFullscreen, setIsFriendFullscreen] = useState(false);
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
			{remoteStream && (
				<div
					className={`friend-video ${isFriendFullscreen ? 'fullscreen' : ''} ${
						isUserFullscreen ? 'user-active' : ''
					}`}
				>
					<video playsInline src="" onClick={toggleFriendScreen} ref={friendVideo} autoPlay className="video" />
				</div>
			)}

			{stream && (
				<div
					className={`user-video ${isUserFullscreen ? 'fullscreen' : ''} ${
						isFriendFullscreen ? 'friend-active' : ''
					}`}
				>
					<video playsInline muted src="" ref={userVideo} onClick={toggleUserScreen} autoPlay className="video" />
				</div>
			)}
		</div>
	);
};

export default VideoPlayer;
