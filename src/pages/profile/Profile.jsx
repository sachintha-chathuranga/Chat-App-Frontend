import React, {useCallback, useContext, useEffect, useState} from 'react';
import {clearError} from '../../apiCalls';
import Update from '../../component/Update';
import Warnnig from '../../component/Warnnig';
import {AuthContext} from '../../context/AuthContext/AuthContext';
import './profile.css';
import { SocketContext } from '../../context/SocketContext/SocketContext';

export default function Profile() {
	const {socketMsg, setSocketMsg} = useContext(SocketContext);
	const {dispatch} = useContext(AuthContext);
	const [isWarning, setisWarning] = useState(false);
	useEffect(() => {
		return () => {
			setSocketMsg(null);
		};
	}, [socketMsg,setSocketMsg]);
	
	const toggleWarning = useCallback(() => {
		console.log('toogle warongn');
		setisWarning(!isWarning);
		clearError(dispatch);
	}, [isWarning, dispatch]);

	return (
		<div className="wrapper">
			<section className="profile">
				{!isWarning ? <Update toggleWarning={toggleWarning} /> : <Warnnig toggleWarning={toggleWarning} />}
			</section>
		</div>
	);
}
