import axios from 'axios';
import {axiosPublic} from './axios';
import {
	ClearError,
	LogOut,
	LoginFailure,
	LoginStart,
	LoginSuccess,
	UpdateFailure,
	UpdateStart,
} from './context/AuthActions';

const API_URL = process.env.REACT_APP_API_URL;

export const getNewToken = async (dispatch) => {
	try {
		const res = await axiosPublic.get(`tokens/update`);
		dispatch(LoginSuccess(res.data));
		sessionStorage.setItem('user', JSON.stringify(res.data));
		return res.data.access_token;
	} catch (err) {
		if (!err?.response) {
			dispatch(LoginFailure('No Sever Response'));
			return null;
		} else if (err.response?.data) {
			dispatch(LogOut());
			sessionStorage.removeItem('user');
			return null;
		} else {
			dispatch(LoginFailure('You are currently offline. Check your internet Connection!'));
			return null;
		}
	}
};
export const loginCall = async (userCredintial, dispatch) => {
	dispatch(LoginStart(userCredintial));
	try {
		const res = await axiosPublic.post(`users/login`, userCredintial);
		dispatch(LoginSuccess(res.data));
		sessionStorage.setItem('user', JSON.stringify(res.data));
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
		const res = await axios.post(`${API_URL}users/signUp`, userCredintial);
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
export const logOutCall = async (axiosPrivate, dispatch) => {
	dispatch(UpdateStart());
	try {
		const res = await axiosPrivate.post(`users/logout`);
		dispatch(LogOut());
		sessionStorage.removeItem('user');
		console.log('sucsess');
		return res.status;
	} catch (err) {
		if (!err?.response) {
			dispatch(UpdateFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(UpdateFailure(err.response.data));
			return err.response.status;
		} else {
			dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
export const userUpdateCall = async (axiosPrivate, userCredintial, dispatch) => {
	dispatch(UpdateStart());
	try {
		const res = await axiosPrivate.put(`users/`, userCredintial);
		dispatch(LoginSuccess(res.data));
		sessionStorage.setItem('user', JSON.stringify(res.data));
		return res.status;
	} catch (err) {
		if (!err?.response) {
			dispatch(UpdateFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(UpdateFailure(err.response.data));
			return err.response.status;
		} else {
			dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
export const userDeleteCall = async (axiosPrivate, userCredintial, dispatch) => {
	dispatch(UpdateStart());
	try {
		const res = await axiosPrivate.delete(`users/`, {data: userCredintial});
		dispatch(LogOut());
		sessionStorage.removeItem('user');
		return res.status;
	} catch (err) {
		if (!err?.response) {
			dispatch(UpdateFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(UpdateFailure(err.response.data));
			return err.response.status;
		} else {
			dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
export const fetchFriend = async (axiosPrivate, index) => {
	try {
		const res = await axiosPrivate.get(index ? `users/friends?index=${index}` : `users/friends`);
		return res.data;
	} catch (error) {
		console.log(error);
		return [];
	}
};
export const getFriend = async (axiosPrivate, friend_id, dispatch) => {
	dispatch(UpdateStart());
	try {
		const res = await axiosPrivate.get(`users/${friend_id}`);
		dispatch(ClearError());
		return res.data;
	} catch (err) {
		if (!err?.response) {
			dispatch(UpdateFailure('No Sever Response'));
			return null;
		} else if (err.response?.data) {
			dispatch(UpdateFailure(err.response.data));
			return null;
		} else {
			dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
			return null;
		}
	}
};
export const searchFriend = async (axiosPrivate, index, searchInput) => {
	try {
		const res = await axiosPrivate.post(index ? `users/search?index=${index}` : `users/search`, {name: searchInput});
		return res.data;
	} catch (err) {
		console.log(err);
		return [];
	}
};

export const fetchMessages = async (axiosPrivate, friend_id) => {
	const res = await axiosPrivate.get(`messages/message?friend_id=${friend_id}`);
	return res.data;
};
export const clearMessages = async (axiosPrivate, friend_id, dispatch) => {
	dispatch(UpdateStart());
	axiosPrivate
		.delete(`messages/messages/clear?friend_id=${friend_id}`)
		.then((res) => {
			dispatch(ClearError());
		})
		.catch((err) => {
			dispatch(ClearError());
		});
};
export const readAllMessages = async (axiosPrivate, friend_id) => {
	try {
		axiosPrivate.put(`messages/messages/update?friend_id=${friend_id}`);
	} catch (err) {
		console.log(err);
	}
};
export const fetchAllNotification = async (axiosPrivate) => {
	try {
		const res = await axiosPrivate.get(`messages/messages/notifications`);
		return res.data;
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const clearError = (dispatch) => {
	dispatch(ClearError());
};

export const getSignRequest = async (axiosPrivate, file, dispatch) => {
	try {
		const res = await axiosPrivate.get(`aws/sign-s3?file_name=${encodeURIComponent(file.name)}&file_type=${file.type}`);
		return res;
	} catch (err) {
		if (!err?.response) {
			dispatch(UpdateFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(UpdateFailure(err.response.data));
			return err.response;
		} else {
			dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
export const deletPicture = async (axiosPrivate, profile_pic, dispatch) => {
	try {
		const res = await axiosPrivate.delete(`aws/sign-s3/delete?file_name=${profile_pic}`);
		return res;
	} catch (err) {
		if (!err?.response) {
			dispatch(UpdateFailure('No Sever Response'));
			return 500;
		} else if (err.response?.data) {
			dispatch(UpdateFailure(err.response.data));
			return err.response;
		} else {
			dispatch(UpdateFailure('You are currently offline. Check your internet Connection!'));
			return 500;
		}
	}
};
