import {useContext} from 'react';
import {Navigate, Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import ThemeButton from './component/ThemeButton';
import {AuthContext} from './context/AuthContext';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import SignUp from './pages/signup/SignUp';

function App() {
	const {user} = useContext(AuthContext);

	return (
		<>
			<Router>
				<Routes>
					<Route exact path="/" element={user ? <Home /> : <Navigate to="/login" />} />

					<Route
						path="/login"
						element={
							user ? (
								<Navigate to="/" />
							) : (
								<>
									<ThemeButton type={'outside'} />
									<Login />
								</>
							)
						}
					/>

					<Route
						path="/signUp"
						element={
							user ? (
								<Navigate to="/" />
							) : (
								<>
									<ThemeButton type={'outside'} />
									<SignUp />
								</>
							)
						}
					/>

					<Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

					<Route path="/chat/:friend_id" element={user ? <Chat /> : <Navigate to="/login" />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
