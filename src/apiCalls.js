import axios from 'axios';
import {publicApi, tokenApi} from './axios';
import {
	ClearError,
	LogOut,
	LoginFailure,
	LoginStart,
	LoginSuccess,
	UpdateStart,
} from './context/AuthContext/AuthActions';
import handleError from './utils/errorHandler';

const API_URL = process.env.REACT_APP_API_URL;

export const getNewToken = async (dispatch) => {
	try {
		const res = await tokenApi.put(`auth/update-token`);
		dispatch(LoginSuccess(res.data));
		let user = JSON.parse(localStorage.getItem('user'));
		user
			? localStorage.setItem('user', JSON.stringify(res.data))
			: sessionStorage.setItem('user', JSON.stringify(res.data));
		return res.data.access_token;
	} catch (err) {
		if (!err?.response) {
			dispatch(LoginFailure('No Sever Response'));
			return null;
		} else if (err.response?.data) {
			alert(err.response.data);
			dispatch(LogOut());
			localStorage.removeItem('user');
			sessionStorage.removeItem('user');
			return null;
		} else {
			dispatch(LoginFailure('You are currently offline. Check your internet Connection!'));
			return null;
		}
	}
};

export const loginCall = async (userCredintial, rememberMe, dispatch) => {
	dispatch(LoginStart(userCredintial));
	try {
		const res = await publicApi.post(`auth/sign-in`, userCredintial);
		dispatch(LoginSuccess(res.data));

		rememberMe
			? localStorage.setItem('user', JSON.stringify(res.data))
			: sessionStorage.setItem('user', JSON.stringify(res.data));
		return res.status;
	} catch (err) {
		if (!err?.response) {
			dispatch(LoginFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(LoginFailure(err.response.data));
			return err.response.status;
		} else {
			dispatch(LoginFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
export const signUpCall = async (userCredintial, dispatch) => {
	dispatch(LoginStart());
	try {
		const res = await axios.post(`${API_URL}auth/sign-up`, userCredintial);
		dispatch(LoginSuccess(res.data));
		return res.status;
	} catch (err) {
		if (!err?.response) {
			dispatch(LoginFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(LoginFailure(err.response.data));
			return err.response.status;
		} else {
			dispatch(LoginFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
export const logOutCall = async (privateApi, dispatch, userId) => {
	dispatch(UpdateStart());
	try {
		const res = await privateApi.post(`auth/sign-out`, {userId});
		dispatch(LogOut());
		localStorage.removeItem('user');
		sessionStorage.removeItem('user');
		return res.status;
	} catch (err) {
		handleError(err, dispatch);
		return 500;
	}
};
export const userUpdateCall = async (privateApi, userCredintial, dispatch) => {
	dispatch(UpdateStart());
	try {
		const res = await privateApi.put(`users/`, userCredintial);
		dispatch(LoginSuccess(res.data));
		let user = JSON.parse(localStorage.getItem('user'));
		user
			? localStorage.setItem('user', JSON.stringify(res.data))
			: sessionStorage.setItem('user', JSON.stringify(res.data));
		return res.status;
	} catch (err) {
		handleError(err, dispatch);
		return 500;
	}
};
export const userDeleteCall = async (privateApi, userCredintial, dispatch) => {
	dispatch(UpdateStart());
	try {
		const res = await privateApi.delete(`users/`, {data: userCredintial});
		dispatch(LogOut());
		localStorage.removeItem('user');
		sessionStorage.removeItem('user');
		return res.status;
	} catch (err) {
		handleError(err, dispatch);
		return 500;
	}
};
export const fetchFriendList = async (privateApi, index) => {
	try {
		const res = await privateApi.get(index ? `users/recentFriends?index=${index}` : `users/recentFriends`);
		return res.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};
export const getFriend = async (privateApi, friend_id) => {
	try {
		const res = await privateApi.get(`users/${friend_id}`);
		return res.data;
	} catch (err) {
		console.log(err);
		return null;
	}
};
export const searchFriend = async (privateApi, index, searchInput) => {
	try {
		const res = await privateApi.post(index ? `users/search?index=${index}` : `users/search`, {name: searchInput});
		return res.data;
	} catch (err) {
		console.log(err);
		return [];
	}
};

export const fetchMessages = async (privateApi, friend_id) => {
	try {
		const res = await privateApi.get(`messages/message?friend_id=${friend_id}&order_by=ASC`);
		return res.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};
export const clearMessages = async (privateApi, friend_id, dispatch) => {
	dispatch(UpdateStart());
	await privateApi
		.delete(`messages/messages/clear?friend_id=${friend_id}`)
		.then((res) => {
			dispatch(ClearError());
		})
		.catch((err) => {
			dispatch(ClearError());
		});
};
export const readAllMessages = async (privateApi, friend_id) => {
	try {
		await privateApi.put(`messages/messages/update?friend_id=${friend_id}`);
	} catch (err) {
		console.log(err);
	}
};
export const fetchAllNotification = async (privateApi) => {
	try {
		const res = await privateApi.get(`messages/messages/notifications`);
		return res.data;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const clearError = (dispatch) => {
	dispatch(ClearError());
};

export const getSignRequest = async (privateApi, file, dispatch) => {
	try {
		const res = await privateApi.get(
			`aws/sign-s3?file_name=${encodeURIComponent(file.name)}&file_type=${file.type}`
		);
		return res;
	} catch (err) {
		handleError(err, dispatch);
		return 500;
	}
};

export const deletPicture = async (privateApi, profile_pic) => {
	try {
		const res = await privateApi.delete(`aws/sign-s3/delete?file_name=${profile_pic}`);
		return res;
	} catch (err) {
		console.log(err);
		return 500;
	}
};
