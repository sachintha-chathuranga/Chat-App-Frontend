import {
	BrowserRouter as Router,
	Route,
	Navigate,
	Routes,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import { useContext } from "react";

function App() {
	const { user } = useContext(AuthContext);
	return (
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
	);
}

export default App;
