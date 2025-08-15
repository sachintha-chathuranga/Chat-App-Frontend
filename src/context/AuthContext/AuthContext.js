import {createContext, memo, useContext, useMemo, useReducer} from 'react';
import AuthReducer from './AuthReducer';

export const INITIAL_STATE = {
	// user: {
	//     user_id: 1,
	//     fname: "Sachintha",
	//     lname: "Chathuranga",
	//     email: "sachintha@gmail.com",
	//     profil_pic: null,
	//     status: true
	// },
	user: JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user')),
	isFetching: false,
	error: null,
};

const AuthContext = createContext(INITIAL_STATE);

const AuthContextProvider = ({children}) => {
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

	const values = useMemo(
		() => ({
			user: state.user,
			isFetching: state.isFetching,
			error: state.error,
			dispatch,
		}),
		[state.user, state.isFetching, state.error, dispatch]
	);
	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = memo(AuthContextProvider);
