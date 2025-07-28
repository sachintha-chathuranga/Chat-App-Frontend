import {Close, SearchOutlined} from '@mui/icons-material';
import {CircularProgress} from '@mui/material';
import React, {memo, useCallback, useContext, useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';
import {fetchAllNotification} from '../../apiCalls';
import Friend from '../../component/Friend';
import Header from '../../component/Header/Header';
import {AuthContext} from '../../context/AuthContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFriend from '../../hooks/useFriend';
import './home.css';

const API_URL = process.env.REACT_APP_API_SOCKET_URL;
const Home = () => {
	const axiosPrivate = useAxiosPrivate();
	const socket = useRef(null);
	const {user} = useContext(AuthContext);
	const [active, setActive] = useState(false);
	const [isSearch, setIsSearch] = useState(false);
	const [searchInput, setSearch] = useState('');
	const inputElement = useRef();
	const [show, setShow] = useState(false);
	const [notification, setNotification] = useState([]);
	const [isMount, setisMount] = useState(true);
	const [index, setindex] = useState(1);
	const {friends, setfriend, isLoading, error, hasMore} = useFriend(index, active, isSearch, searchInput);

	// For the Pagination
	const intObserver = useRef();
	const lastfriendRef = useCallback(
		(friend) => {
			if (isLoading) return;
			if (intObserver.current) intObserver.current.disconnect();
			intObserver.current = new IntersectionObserver((friends) => {
				if (friends[0].isIntersecting && hasMore) {
					setindex((prev) => prev + 1);
				}
			});
			if (friend) intObserver.current.observe(friend);
		},
		[isLoading, hasMore]
	);

	useEffect(() => {
		fetchAllNotification(axiosPrivate).then((data) => {
			isMount && data && data.length !== 0 && setNotification(data);
		});
		socket.current = io.connect(API_URL);
		socket?.current.on('connect', () => {
			socket?.current?.on('getMessage', (data) => {
				isMount && setNotification((prev) => [...prev, data]);
			});
		});
		socket?.current.on('error', (error) => {
			socket.current?.off();
			socket?.current.disconnect();
		});
		return () => {
			console.log("Home is unmount socket get disconnected")
			setisMount(false);
			socket?.current.off();
			socket?.current.disconnect();
		};
	}, [user, isMount, axiosPrivate]);
	const fetchFriendList = () => {
		setfriend([]);
		setindex(1);
		setActive(!active);
	};
	const searchFriends = () => {
		if (searchInput) {
			setIsSearch(true);
			fetchFriendList();
		}
		inputElement.current.focus();
	};
	const clearSearch = () => {
		if (isSearch) {
			setIsSearch(false);
			fetchFriendList();
		}
		setSearch('');
		inputElement.current.focus();
	};
	const handleInputChange = (text) => {
		if (!text) {
			if (isSearch) {
				setIsSearch(false);
				fetchFriendList();
			}
		}
		setSearch(text);
	};

	return (
		<div className="wrapper">
			<section className="users" onClick={() => show && setShow(false)}>
				<Header user={user} logUserId={user.user_id} headerType={'home'} />
				<form
					className="search"
					onSubmit={(e) => {
						e.preventDefault();
						searchFriends();
					}}
				>
					<input
						type="text"
						autoFocus
						value={searchInput}
						onChange={(e) => handleInputChange(e.target.value)}
						ref={inputElement}
						placeholder="Enter name to search..."
					/>

					{searchInput && (
						<button type="button" className="clear-btn" onClick={clearSearch}>
							<Close />
						</button>
					)}

					<button type="submit" className="search-btn" disabled={!searchInput}>
						<SearchOutlined />
					</button>
				</form>
				<div className="users-list">
					{error && <div className="error-txt">{error}</div>}

					{!isLoading &&
						friends.map((f, i) => {
							socket?.current.emit('joinRoom', user.user_id + Number(f.user_id));
							if (friends.length === i + 1) {
								return (
									<div key={f.user_id} ref={lastfriendRef}>
										<Friend notifi={notification} friend={f} />
									</div>
								);
							}
							return <Friend key={f.user_id} notifi={notification} friend={f} />;
						})}

					{isLoading && (
						<div className="loading-wrap">
							<CircularProgress
								style={{
									color: '#c2c2c9',
									width: '30px',
									height: '30px',
								}}
							/>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default Home;
