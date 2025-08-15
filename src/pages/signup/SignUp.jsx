import {VisibilityOffOutlined, VisibilityOutlined} from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
import {useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {clearError, signUpCall} from '../../apiCalls';
import {useAuth} from '../../context/AuthContext/AuthContext';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

function SignUp() {
	const {isFetching, error, dispatch} = useAuth();
	const fname = useRef();
	const lname = useRef();
	const email = useRef();
	const password = useRef();
	const [isActive, setisActive] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const user = {
			fname: fname.current.value.trim(),
			lname: lname.current.value.trim(),
			email: email.current.value.trim(),
			password: password.current.value.trim(),
		};
		signUpCall(user, dispatch).then((res) => {
			if (res === 200) {
				navigate('/login');
			} else {
				setTimeout(() => {
					clearError(dispatch);
				}, 5000);
			}
		});
	};

	return (
		<div className="wrapper">
			<section className="form signup">
				<header>
					<img className="logo" src={PF + 'favicon.ico'} alt="Logo" />
					<h3>Bliss Chat </h3>
				</header>
				<form onSubmit={handleSubmit} autoComplete="off">
					{error && <div className="error-txt">{error}</div>}
					<div className="name-details">
						<div className="field input">
							<label>First Name</label>
							<input
								type="text"
								ref={fname}
								placeholder="First Name"
								required
								minLength="3"
								maxLength="15"
								pattern="[A-Za-z]+"
								title="Please enter only alphabetic characters!"
							/>
						</div>
						<div className="field input">
							<label>Last Name</label>
							<input
								type="text"
								ref={lname}
								placeholder="Last Name"
								required
								minLength="3"
								maxLength="15"
								pattern="[A-Za-z]+"
								title="Please enter only alphabetic characters!"
							/>
						</div>
					</div>
					<div className="field input">
						<label>Email Address</label>
						<input type="email" ref={email} placeholder="Enter your email" required />
					</div>
					<div className="field input">
						<label>Password</label>
						<input
							type={isActive ? 'text' : 'password'}
							ref={password}
							placeholder="Enter new password"
							required
						/>
						{isActive ? (
							<VisibilityOffOutlined className={'svg active'} onClick={() => setisActive(!isActive)} />
						) : (
							<VisibilityOutlined className={'svg'} onClick={() => setisActive(!isActive)} />
						)}
					</div>

					<div className="field button">
						<button type="submit" className="loginBtn" disabled={isFetching}>
							{isFetching ? (
								<CircularProgress
									style={{
										color: 'white',
										width: '30px',
										height: '30px',
									}}
								/>
							) : (
								'Sign UP'
							)}
						</button>
					</div>
				</form>
				<div className="link">
					Already signed up? <Link to="/login">Login </Link>now
				</div>
			</section>
		</div>
	);
}

export default SignUp;
