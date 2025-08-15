import React, {useCallback, useState} from 'react';
import {clearError} from '../../apiCalls';
import Update from '../../component/Update';
import Warnnig from '../../component/Warnnig';
import {useAuth} from '../../context/AuthContext/AuthContext';
import './profile.css';

export default function Profile() {
	const {dispatch} = useAuth();
	const [isWarning, setisWarning] = useState(false);

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
