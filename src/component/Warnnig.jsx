import {VisibilityOffOutlined, VisibilityOutlined} from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
import React, {memo, useContext, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {clearError, userDeleteCall} from '../apiCalls';
import {AuthContext} from '../context/AuthContext/AuthContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function Warnnig({toggleWarning}) {
	const navigate = useNavigate();
	const password = useRef();
	const [isActive, setisActive] = useState(false);
	const [isNext, setIsNext] = useState(false);
	const {user, isFetching, error, dispatch} = useContext(AuthContext);
	const axiosPrivate = useAxiosPrivate();

	const handleDelete = (e) => {
		e.preventDefault();
		const data = {
			user_id: user.user_id,
		};
		password.current.value && (data.password = password.current.value.trim());

		userDeleteCall(axiosPrivate, data, dispatch).then((res) => {
			res === 200
				? navigate('/login')
				: setTimeout(() => {
						clearError(dispatch);
				  }, 5000);
		});
	};

	return (
		<div className="msg-wrapper">
			<h3>warning!</h3>
			{error && <div className="error-txt">{error}</div>}
			<div className="msg-body">
				<div id="step-1">
					<p>Please confirm if you wish to delete your account. This action cannot be undone.</p>
					{!isNext && (
						<div id="foot">
							<button onClick={() => toggleWarning()} className="cancel-btn">
								Cancel
							</button>
							<button onClick={() => setIsNext(true)} className="yes-btn">
								Yes
							</button>
						</div>
					)}
				</div>
				{isNext && (
					<form id="step-2" onSubmit={handleDelete}>
						<label>Pleas Enter your password.</label>
						<input
							readOnly={isFetching}
							type={isActive ? 'text' : 'password'}
							ref={password}
							placeholder="password"
							required
						/>
						{/* <i
							className={isActive ? 'fas fa-eye active' : 'fas fa-eye'}
							onClick={() => setisActive(!isActive)}
						></i> */}
						{isActive ? (
							<VisibilityOffOutlined className={'svg active'} onClick={() => setisActive(!isActive)} />
						) : (
							<VisibilityOutlined className={'svg'} onClick={() => setisActive(!isActive)} />
						)}
						<div id="foot">
							<button
								onClick={() => {
									toggleWarning();
									clearError(dispatch);
								}}
								className="cancel-btn"
								disabled={isFetching}
							>
								{isFetching ? (
									<CircularProgress
										style={{
											color: 'black',
											width: '13px',
											height: '13px',
										}}
									/>
								) : (
									'Cancel'
								)}
							</button>
							<button type="submit" className="yes-btn" disabled={isFetching}>
								{isFetching ? (
									<CircularProgress
										style={{
											color: 'black',
											width: '13px',
											height: '13px',
										}}
									/>
								) : (
									'Delete'
								)}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

export default memo(Warnnig);
