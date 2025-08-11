import {Button} from '@mui/material';
import React from 'react';
import {useVideoCall} from '../../context/VideoCallContext/VideoCallContext';
import './callNotification.css';
import { useNavigate } from 'react-router-dom';
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;
const CallNotification = () => {
	const {answerCall, call, incomingCall} = useVideoCall();
	const navigate = useNavigate()
	const takeCall = () =>{
		answerCall()
		navigate('/chat/'+call.user?.user_id);
	}
	return (
		<>
			{incomingCall && (
				<div className="friend">
					<div className="content">
						<img
							src={call.user?.profil_pic ? imageUrl + call.user?.profil_pic : PF + 'default.png'}
							alt="proPic"
						/>
						<div className="details">
							<span>{call.user?.fname + ' ' + call.user?.lname}</span>
							<p>Incomming Call!</p>
						</div>
					</div>
					<div className="right-side">
						<Button variant="contained" color="primary" onClick={takeCall}>
							Answer
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default CallNotification;
