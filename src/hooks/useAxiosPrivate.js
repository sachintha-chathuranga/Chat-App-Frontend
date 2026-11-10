import {useEffect} from 'react';
import {getNewToken} from '../apiCalls';
import {publicApi} from '../axios';
import {useAuth} from '../context/AuthContext/AuthContext';

// Shared between all requests using this module
let refreshPromise = null;

const useAxiosPrivate = () => {
	const {user, dispatch} = useAuth();

	useEffect(() => {
		const requestIntercept = publicApi.interceptors.request.use(
			(config) => {
				if (!config.headers['Authorization']) {
					config.headers['Authorization'] = `Bearer ${user?.access_token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = publicApi.interceptors.response.use(
			(response) => response,
			async (err) => {
				const prevRequest = err?.config;
				if (err?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;

					// Start refreshing only if no refresh is running
					if (!refreshPromise) {
						refreshPromise = getNewToken(dispatch).finally(() => {
							refreshPromise = null;
						});
					}
					// Wait for the shared refresh operation
					const token = await refreshPromise;
					if (token) {
						prevRequest.headers['Authorization'] = `Bearer ${token}`;
						return publicApi(prevRequest);
					}
					return Promise.reject(err);
				}
				return Promise.reject(err);
			}
		);

		return () => {
			publicApi.interceptors.request.eject(requestIntercept);
			publicApi.interceptors.response.eject(responseIntercept);
		};
	}, [user, dispatch]);

	return publicApi;
};

export default useAxiosPrivate;
