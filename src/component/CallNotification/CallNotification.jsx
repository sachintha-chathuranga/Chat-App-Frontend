import {Call, CallEnd, Close} from '@mui/icons-material';
import {IconButton} from '@mui/material';
import React, {memo} from 'react';
import {useNavigate} from 'react-router-dom';
import {useVideoCall} from '../../context/VideoCallContext/VideoCallContext';
import './callNotification.css';
import { PF, imageUrl } from '../../constant/env';

const CallNotification = () => {
	const {answerCall, call, incomingCall, outgoingCall, rejectIncommingCall, leaveCall, errorMessage} = useVideoCall();
	
	const navigate = useNavigate();

	const takeCall = () => {
		answerCall(navigate);
	};

	const handleCancel = () => {
		if (incomingCall) {
			rejectIncommingCall();
		} else {
			leaveCall('local');
		}
	};

	return (
		<>
			{(incomingCall || outgoingCall || errorMessage) && (
				<div className="notification">
					<div className={`notification-wrapper ${errorMessage && 'error'}`}>
						<div className="content">
							<img
								src={call.user?.profil_pic ? imageUrl + call.user?.profil_pic : PF + 'default.png'}
								alt="proPic"
							/>
							<div className="details">
								<span>{call.user?.fname + ' ' + call.user?.lname}</span>
								<p>{errorMessage ? errorMessage : incomingCall ? 'Incomming Call....' : 'Outgoing Call...'}</p>
							</div>
						</div>
						<div className="right-side">
							{errorMessage ? (
								<IconButton
									sx={{
										color: 'white',
										'&:hover': {
											backgroundColor: '#911717d3',
										},
									}}
									onClick={() => leaveCall('remote')}
								>
									<Close />
								</IconButton>
							) : (
								<IconButton
									sx={{
										backgroundColor: '#e63c3c',
										color: 'white',
										'&:hover': {
											backgroundColor: '#cc1212',
										},
									}}
									onClick={() => handleCancel()}
								>
									<CallEnd />
								</IconButton>
							)}
							{incomingCall && (
								<IconButton
									sx={{
										backgroundColor: '#13b413',
										color: 'white',
										'&:hover': {
											backgroundColor: '#049104',
										},
									}}
									onClick={takeCall}
								>
									<Call />
								</IconButton>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(CallNotification);
