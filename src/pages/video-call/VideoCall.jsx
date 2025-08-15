import {CallEnd, Mic, MicOff, Videocam, VideocamOff} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import VideoPlayer from '../../component/VideoPlayer/VideoPlayer';
import {useVideoCall} from '../../context/VideoCallContext/VideoCallContext';
import './videoCall.css';

const VideoCall = () => {
	console.log('Video Call render');
	const {stream, isInVideoCall, leaveCall} = useVideoCall();
	const [isCamOn, setIsCamOn] = useState(true);
	const [isMicOn, setIsMicOn] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		if (stream) {
			const videoTrack = stream.getVideoTracks()[0];
			setIsCamOn(videoTrack.enabled);
			const audioTrack = stream.getAudioTracks()[0];
			setIsMicOn(audioTrack.enabled);
		}
	}, [stream]);

	useEffect(() => {
		if (!isInVideoCall) {
			navigate(-1)
		}
	}, [isInVideoCall]);

	const toggleCamera = useCallback(() => {
		if (stream) {
			const videoTrack = stream.getVideoTracks()[0];
			videoTrack.enabled = !videoTrack.enabled;
			setIsCamOn(videoTrack.enabled);
		}
	}, [stream]);
	const toggleMic = useCallback(() => {
		if (stream) {
			const audioTrack = stream.getAudioTracks()[0];
			audioTrack.enabled = !audioTrack.enabled;
			setIsMicOn(audioTrack.enabled);
		}
	}, [stream]);

	const endCall = useCallback(() => {
		leaveCall();
		navigate(-1);
	}, [navigate, leaveCall]);

	return (
		<div className="video-call-wrapper">
			<VideoPlayer />
			<div className="call-options">
				<div className="button-group">
					<IconButton onClick={toggleMic} disabled={!stream}>
						{isMicOn ? <Mic color="primary" fontSize="large" /> : <MicOff color="primary" fontSize="large" />}
					</IconButton>
					<span className='border'>
					<IconButton onClick={toggleCamera} disabled={!stream}>
						{isCamOn ? (
							<Videocam color="primary" fontSize="large" />
						) : (
							<VideocamOff color="primary" fontSize="large" />
						)}
					</IconButton>
					</span>
					<IconButton onClick={endCall} color="error">
						<CallEnd color="error" fontSize="large" />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

export default memo(VideoCall);
