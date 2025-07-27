import {
	ArrowBack,
	DeleteOutline,
	DeleteSweepOutlined,
	ExitToAppOutlined,
	HomeOutlined,
	MoreVert,
} from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { memo, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearError, clearMessages, logOutCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ThemeButton from '../ThemeButton';
import './header.css';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Header = (props) => {
	const {isFetching, dispatch} = useContext(AuthContext);
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();
	const [fullName, setFullName] = useState('');
	const [show, setShow] = useState(false);

	useEffect(() => {
		props.user.fname && setFullName(`${props.user.fname} ${props.user.lname}`);
	}, [fullName, props.user.fname, props.user.lname]);

	// For handle outside clicks to close dropdown menu
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!e.target.closest('.dropdown')) {
				setShow(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleBack = () => {
		if (props.hasOwnProperty('toggleFrame')) {
			props.toggleFrame();
		} else {
			navigate(-1);
		}
	};
	const handleLogout = () => {
		setShow(false);
		logOutCall(axiosPrivate, dispatch).then((res) => {
			res === 200
				? navigate('/login')
				: setTimeout(() => {
						clearError(dispatch);
				  }, 5000);
		});
	};
	const handleButton = () => {
		setShow(false);
		if (props.headerType === 'profile' || props.headerType === 'update') {
			props.toggleWarning();
		} else {
			props.isEmpty &&
				clearMessages(axiosPrivate, props.user.user_id, dispatch).then(() => {
					props.setMessages([]);
				});
		}
	};

	return (
		<header id="header">
			<div className="content">
				{props.headerType !== 'home' ? (
					<div className="back-icon" onClick={handleBack}>
						<ArrowBack />
					</div>
				) : (
					<></>
				)}
				<img src={props.user?.profil_pic ? imageUrl + props.user?.profil_pic : PF + 'default.png'} alt="proPic" />
				<div className="details">
					<span className={isFetching ? 'skelton' : ''}>
						{!isFetching && (fullName ? fullName : props.user?.fname + ' ' + props.user?.lname)}
					</span>
					<p className={isFetching ? 'skelton' : ''}>{!isFetching && (props.user?.status ? 'Online' : 'Offline')}</p>
				</div>
			</div>
			<div className="dropdown">
				<div className="dropbtn">
					<MoreVert onClick={() => setShow(!show)} style={{fontSize: '1.8rem'}} />
				</div>

				<div id="myDropdown" className={show ? 'dropdown-content show' : 'dropdown-content'}>
					{props.headerType !== 'home' ? (
						<Link onClick={() => setShow(false)} className="item" to={'/'}>
							<HomeOutlined /> Home
						</Link>
					) : (
						''
					)}
					{props.headerType !== 'profile' ? (
						<Link onClick={() => setShow(false)} className="item" to={'/profile'}>
							<AccountCircleOutlinedIcon /> Account
						</Link>
					) : (
						''
					)}
					{props.headerType !== 'home' ? (
						<div onClick={handleButton} className="item">
							{props.headerType === 'chat' ? (
								<>
									<DeleteSweepOutlined />
									Clear chat
								</>
							) : (
								<>
									<DeleteOutline />
									Delete Account
								</>
							)}
						</div>
					) : (
						<></>
					)}
				

					<ThemeButton setShow={setShow} type={'header'} />
					

					<div onClick={handleLogout} className="item">
						<ExitToAppOutlined />
						Logout
					</div>
				</div>
			</div>
		</header>
	);
};

export default memo(Header);
