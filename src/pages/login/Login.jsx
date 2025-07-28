import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { clearError, loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Login() {
	const email = useRef();
	const password = useRef();
	const [isActive, setisActive] = useState(false);
	const { isFetching, error, dispatch } = useContext(AuthContext);

	const handleSubmit = (e) => {
		e.preventDefault();
		loginCall(
			{
				email: email.current.value.trim(),
				password: password.current.value.trim(),
			},
			dispatch
		).then((res) => {
			if (res !== 200) {
				setTimeout(() => {
					clearError(dispatch);
				}, 5000);
			}
		});
	};

	return (
		<div className="wrapper">
			<section className="form login">
				<header>
					<img className="logo" src={PF + 'favicon.ico'} alt="Logo" />
					<h3>Bliss Chat </h3>
				</header>
				<form onSubmit={handleSubmit} autoComplete="off">
					{error && <div className="error-txt">{error}</div>}
					<div className="field input">
						<label>Email Address</label>
						<input
							type="email"
							ref={email}
							placeholder="Enter your email"
							required
						/>
					</div>
					<div className="field input">
						<label>Password</label>
						<input
							type={isActive ? 'text' : 'password'}
							ref={password}
							placeholder="Enter your password"
							required
						/>
						{isActive ? (
							<VisibilityOffOutlined
								className={'svg active'}
								onClick={() => setisActive(!isActive)}
							/>
						) : (
							<VisibilityOutlined
								className={'svg'}
								onClick={() => setisActive(!isActive)}
							/>
						)}
					</div>
					<div className="field button">
						<button
							type="submit"
							className="loginBtn"
							disabled={isFetching}
						>
							{isFetching ? (
								<CircularProgress
									style={{
										color: 'white',
										width: '30px',
										height: '30px',
									}}
								/>
							) : (
								'Login'
							)}
						</button>
					</div>
				</form>
				<div className="link">
					Not yet signed up? <Link to="/signUp">Signup </Link>now
				</div>
			</section>
		</div>
	);
}
