import { Cancel, PermMedia } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { memo, useContext, useRef, useState } from 'react';
import {
	clearError,
	deletPicture,
	getSignRequest,
	userUpdateCall,
} from '../apiCalls';
import { UpdateFailure, UpdateStart } from '../context/AuthActions';
import { AuthContext } from '../context/AuthContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Header from './Header';

const validFileType = ['image/png', 'image/jpg', 'image/jpeg'];

const Update = ({ toggleFrame, toggleWarning }) => {
	const { user, isFetching, error, dispatch } = useContext(AuthContext);
	const [file, setFile] = useState(null);
	const fileInput = useRef(null);
	const [isLoading, setisLoading] = useState(false);
	const [success, setsuccess] = useState(null);
	const [signedRequest, setsignedRequest] = useState(null);
	const [uploadProgress, setuploadProgress] = useState(0);
	const [profileUrl, setprofileUrl] = useState(null);
	const fname = useRef();
	const lname = useRef();
	const email = useRef();
	const password = useRef();
	const [isActive, setisActive] = useState(false);
	const [severError, setSeverError] = useState(null);
	const axiosPrivate = useAxiosPrivate();

	const deleteFile = () => {
		setisLoading(true);
		deletPicture(axiosPrivate, user.profil_pic, dispatch).then((res) => {
			setisLoading(false);
			const data = {
				profil_pic: null,
			};
			if (res.status === 200) {
				setsuccess(res.data);
				userUpdateCall(axiosPrivate, data, dispatch).then((res) => {
					res === 200
						? toggleFrame()
						: setTimeout(() => {
								clearError(dispatch);
								setsuccess(null);
						  }, 5000);
				});
			} else {
				setTimeout(() => {
					clearError(dispatch);
				}, 5000);
			}
		});
	};

	const uploadFile = async (file, signReq) => {
		dispatch(UpdateStart());
		try {
			const res = await axios.put(signReq, file, {
				onUploadProgress: (progressEvent) => {
					const progress = Math.round(
						(progressEvent.loaded / progressEvent.total) * 100
					);
					setuploadProgress(progress);
				},
			});
			return res.status;
		} catch (err) {
			if (!err?.response) {
				dispatch(UpdateFailure('No Sever Response'));
				return 500;
			} else if (err.response?.data) {
				dispatch(UpdateFailure("profile picture doesn't upload"));
				return err.response.status;
			} else {
				dispatch(
					UpdateFailure(
						'You are currently offline. Check your internet Connection!'
					)
				);
				return 500;
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			user_id: user.user_id,
		};
		fname.current.value && (data.fname = fname.current.value.trim());
		lname.current.value && (data.lname = lname.current.value.trim());
		email.current.value && (data.email = email.current.value.trim());
		password.current.value && (data.password = password.current.value.trim());
		file && (data.profil_pic = encodeURIComponent(profileUrl));

		if (signedRequest !== null && file !== null) {
			deletPicture(axiosPrivate, user.profil_pic, dispatch);
			uploadFile(file, signedRequest, dispatch).then((res) => {
				if (res === 200) {
					userUpdateCall(axiosPrivate, data, dispatch).then((res) => {
						res === 200
							? toggleFrame()
							: setTimeout(() => {
									clearError(dispatch);
							  }, 5000);
					});
				} else {
					setTimeout(() => {
						clearError(dispatch);
					}, 5000);
					setFile(null);
					setsignedRequest(null);
				}
			});
		} else if (data.email || data.password || data.fname || data.lname) {
			userUpdateCall(axiosPrivate, data, dispatch).then((res) => {
				res === 200
					? toggleFrame()
					: setTimeout(() => {
							clearError(dispatch);
					  }, 5000);
			});
		}
	};

	const handleFile = (newFile) => {
		if (newFile) {
			if (!validFileType.find((type) => type === newFile.type)) {
				setSeverError('File must be in jpg, png or jpeg format');
				setTimeout(() => {
					setSeverError(null);
				}, 5000);
				setFile(null);
				fileInput.current.value = null;
				return;
			} else if (newFile.size > 2000000) {
				setSeverError('File size should be less than 2MB');
				setTimeout(() => {
					setSeverError(null);
				}, 5000);
				setFile(null);
				fileInput.current.value = null;
				return;
			}
			setFile(newFile);
			getSignRequest(axiosPrivate, newFile, dispatch).then((res) => {
				if (res.status === 200) {
					const urlObj = new URL(res.data.signedRequest);
					// Get the pathname part and extract the last segment (filename)
					const pathSegments = urlObj.pathname.split('/');
					const fileNameWithExtension =
						pathSegments[pathSegments.length - 1];
					setprofileUrl(fileNameWithExtension);
					setsignedRequest(res.data.signedRequest);
				} else {
					setFile(null);
					setSeverError('Sever does not give any response!');
					setTimeout(() => {
						setSeverError(null);
					}, 5000);
				}
			});
		}
	};

	return (
		<>
			<Header
				user={user}
				toggleFrame={toggleFrame}
				toggleWarning={toggleWarning}
			/>
			<span>
				<strong>Update Details</strong>
			</span>
			<form onSubmit={handleSubmit} autoComplete="off">
				{success && <div className="success-txt">{success}</div>}
				{error && <div className="error-txt">{error}</div>}
				{severError && <div className="error-txt">{severError}</div>}
				<div className="name-details">
					<div className="field input">
						<label>First Name</label>
						<input
							type="text"
							ref={fname}
							placeholder={user.fname}
							minLength="3"
							maxLength="15"
							pattern="[A-Za-z]+"
							title="Please enter only alphabetic characters!"
						/>
					</div>
					<div className="field input">
						<label>Last Name</label>
						<input
							type="text"
							ref={lname}
							placeholder={user.lname}
							minLength="3"
							maxLength="15"
							pattern="[A-Za-z]+"
							title="Please enter only alphabetic characters!"
						/>
					</div>
				</div>
				<div className="field input">
					<label>Email Address</label>
					<input type="email" ref={email} placeholder={user.email} />
				</div>
				<div className="field input">
					<label>Password</label>
					<input
						type={isActive ? 'text' : 'password'}
						ref={password}
						placeholder="Enter new password"
					/>
					<i
						className={isActive ? 'fas fa-eye active' : 'fas fa-eye'}
						onClick={() => setisActive(!isActive)}
					></i>
				</div>
				<div className="field image">
					<label>Change Profile picture</label>
					<div className="shareOption">
						<label className="buttonImg" htmlFor="file">
							<PermMedia htmlColor="tomato" className="shareIcon" />
							<span className="shareOptionText">Photo</span>
							<input
								ref={fileInput}
								style={{ display: 'none' }}
								type="file"
								id="file"
								onChange={(e) => handleFile(e.target.files[0])}
							/>
						</label>
						{file && (
							<div className="uploadPhoto">
								<img
									src={URL.createObjectURL(file)}
									alt="selectedImg"
								/>
								<Cancel
									className="cancelImg"
									onClick={() => {
										setFile(null);
										fileInput.current.value = null;
									}}
								/>
							</div>
						)}
						{file && isFetching && (
							<div className="progressBar">
								<div
									className="progress"
									style={{ width: `${uploadProgress}%` }}
								></div>
							</div>
						)}
					</div>
					{user.profil_pic && (
						<button
							className="pictureDelBtn"
							disabled={isLoading}
							onClick={deleteFile}
						>
							{isLoading ? (
								<CircularProgress
									style={{
										color: 'black',
										width: '15px',
										height: '15px',
									}}
								/>
							) : (
								'Remove Profile Picture'
							)}
						</button>
					)}
				</div>
				<div className="field button">
					<button type="submit" className="loginBtn" disabled={isFetching}>
						{isFetching ? (
							<CircularProgress
								style={{
									color: 'white',
									width: '26px',
									height: '26px',
								}}
							/>
						) : (
							'Save Changes'
						)}
					</button>
				</div>
			</form>
		</>
	);
};

export default memo(Update);
