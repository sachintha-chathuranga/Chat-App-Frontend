import {Circle} from '@mui/icons-material';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {formatDateTime} from '../utils/dateUtils';
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Friend = ({notifi, friend}) => {
	const [notification, setNotification] = useState([]);

	useEffect(() => {
		setNotification(notifi.filter((obj) => obj.sender_id === friend.user_id));
	}, [notifi, friend]);



	const masgDate = useMemo(() =>{ 
		if (notification.length ===0) {
			return formatDateTime(friend.lastMessageTime)
		} else {
			return formatDateTime(notification[notification.length - 1].createdAt);
		}
	}, [notification]);

	return (
		<Link to={'/chat/' + friend.user_id} style={{textDecoration: 'none'}}>
			<div className="friend">
				<div className="content">
					<img src={friend.profil_pic ? imageUrl + friend.profil_pic : PF + 'default.png'} alt="proPic" />
					{notification.length !== 0 && <span className="notification">{notification.length}</span>}
					<div className="details">
						<span>{friend.fname + ' ' + friend.lname}</span>
						<p>
							{notification.length === 0
								? friend.lastMessage
									? friend.lastMessage
									: 'No any messages yet!'
								: notification[notification.length - 1].message}
						</p>
					</div>
				</div>
				<div className="right-side">
					<div className={friend.status ? 'status-dot' : 'status-dot offline'}>
						<Circle sx={{fontSize: 15}} />
					</div>
					<p>{masgDate}</p>
				</div>
			</div>
		</Link>
	);
};

export default memo(Friend);
