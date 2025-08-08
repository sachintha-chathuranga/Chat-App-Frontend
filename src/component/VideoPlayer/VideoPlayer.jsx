import {Grid2, Paper, Typography} from '@mui/material';
import React, {useContext} from 'react';
import {SocketContext} from '../../SocketContext';
import './videoPlayer.css';
const VideoPlayer = () => {
	const {name, callAccepted, myVideo, userVideo, callEnded, stream, call} = useContext(SocketContext);
	return (
		<Grid2 container className="gridContainer">
			{stream && (
				<Grid2 xs={12} md={6}>
					<Paper className="paper">
						<Typography variant="h5" gutterBottom>
							{name || 'Sachintha'}
						</Typography>
						<video playsInline src="" muted ref={myVideo} autoPlay className="video" />
					</Paper>
				</Grid2>
			)}
			{callAccepted && !callEnded && (
				<Grid2 xs={12} md={6}>
					<Paper className="paper">
						<Typography variant="h5" gutterBottom>
							{call.name || 'Friend Name'}
						</Typography>
						<video playsInline src="" ref={userVideo} autoPlay className="video" />
					</Paper>
				</Grid2>
			)}
		</Grid2>
	);
};

export default VideoPlayer;
