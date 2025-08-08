import {AppBar, Typography} from '@mui/material';
import React from 'react';
import Notification from '../../component/Notification/Notification';
import Options from '../../component/Options/Options';
import VideoPlayer from '../../component/VideoPlayer/VideoPlayer';
import './videoCall.css'

const VideoCall = () => {

	return (
		<div className='wrapper' >
			<AppBar className='appBar' position="static" color="inherit">
				<Typography variant="h2" align="center">
					Video Chat
				</Typography>
			</AppBar>
			<VideoPlayer />
			<Options>
				<Notification />
			</Options>
		</div>
	);
};

export default VideoCall;
