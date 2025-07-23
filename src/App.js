import { useContext, useEffect } from 'react';
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';
import ThemeButton from './component/ThemeButton';
import { AuthContext } from './context/AuthContext';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import SignUp from './pages/signup/SignUp';

const API_URL = process.env.REACT_APP_API_URL;
function App() {
	const { user } = useContext(AuthContext);
	// when user close tab without logout
	useEffect(() => {
		const handleUnload = () => {
			const url = `${API_URL}users/logout`;
			const data = JSON.stringify({ user });
			const blob = new Blob([data], { type: 'application/json' });

			navigator.sendBeacon(url, blob);
		};

		window.addEventListener('unload', handleUnload);
		return () => {
			window.removeEventListener('unload', handleUnload);
		};
		// eslint-disable-next-line
	}, []);
	return (
		<>
			<ThemeButton />
			<Router>
				<Routes>
					<Route
						exact
						path="/"
						element={user ? <Home /> : <Navigate to="/login" />}
					/>

					<Route
						path="/login"
						element={user ? <Navigate to="/" /> : <Login />}
					/>

					<Route
						path="/signUp"
						element={user ? <Navigate to="/" /> : <SignUp />}
					/>

					<Route
						path="/profile"
						element={user ? <Profile /> : <Navigate to="/login" />}
					/>

					<Route
						path="/chat/:friend_id"
						element={user ? <Chat /> : <Navigate to="/login" />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
