import React, { useCallback, useContext, useState } from 'react';
import { clearError } from '../../apiCalls';
import Details from '../../component/Details';
import Update from '../../component/Update';
import Warnnig from '../../component/Warnnig';
import { AuthContext } from '../../context/AuthContext';
import './profile.css';

export default function Profile() {
	const { dispatch } = useContext(AuthContext);
	const [isUpdate, setIsUpdate] = useState(false);
	const [isWarning, setisWarning] = useState(false);

	const toggleFrame = useCallback(() => {
		setIsUpdate(!isUpdate);
		clearError(dispatch);
	}, [isUpdate, dispatch]);

	const toggleWarning = useCallback(() => {
		console.log('toogle warongn');
		setisWarning(!isWarning);
		clearError(dispatch);
	}, [isWarning, dispatch]);

	return (
		<div className="wrapper">
			<section className="profile">
				{!isWarning ? (
					isUpdate ? (
						<Update
							toggleFrame={toggleFrame}
							toggleWarning={toggleWarning}
						/>
					) : (
						<Details
							toggleFrame={toggleFrame}
							toggleWarning={toggleWarning}
						/>
					)
				) : (
					<Warnnig toggleWarning={toggleWarning} />
				)}
			</section>
		</div>
	);
}
