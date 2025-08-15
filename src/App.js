import {Navigate, Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import ThemeButton from './component/ThemeButton';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import SignUp from './pages/signup/SignUp';
import { useAuth } from './context/AuthContext/AuthContext';
import VideoCall from './pages/video-call/VideoCall';

function App() {
	const {user} = useAuth();

	return (
		<>
			<Router>
				<Routes>
					<Route
						exact
						path="/"
						element={
							user ? (
								<>
									<Home />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/login"
						element={
							user ? (
								<Navigate to="/" />
							) : (
								<>
									<ThemeButton type={'outside'} />
									<Login />
									{/* <VideoCall /> */}
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

					<Route
						path="/profile"
						element={
							user ? (
								<>
									<Profile />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/chat/:friend_id"
						element={
							user ? (
								<>
									<Chat />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="/video-call/:friend_id"
						element={
							user ? (
								<>
									<VideoCall />
								</>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
