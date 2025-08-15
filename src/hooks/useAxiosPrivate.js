import {useEffect} from 'react';
import {getNewToken} from '../apiCalls';
import {axiosPublic} from '../axios';
import {useAuth} from '../context/AuthContext/AuthContext';

const useAxiosPrivate = () => {
	const {user, dispatch} = useAuth();

	useEffect(() => {
		const requestIntercept = axiosPublic.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${user?.access_token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axiosPublic.interceptors.response.use(
			(response) => response,
			async (err) => {
				const prevRequest = err?.config;
				if (err?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const token = await getNewToken(dispatch);
					if (token) {
						prevRequest.headers['Authorization'] = `Bearer ${token}`;
						return axiosPublic(prevRequest);
					}
					return Promise.reject(err);
				}
				return Promise.reject(err);
			}
		);

		return () => {
			axiosPublic.interceptors.request.eject(requestIntercept);
			axiosPublic.interceptors.response.eject(responseIntercept);
		};
	}, [user, dispatch]);

	return axiosPublic;
};

export default useAxiosPrivate;
