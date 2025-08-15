import {Close, SearchOutlined} from '@mui/icons-material';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {fetchAllNotification, getFriend} from '../../apiCalls';
import Friend from '../../component/Friend';
import Header from '../../component/Header/Header';
import FriendSkeleton from '../../component/Skeletons/Friend/FriendSkeleton';
import {useAuth} from '../../context/AuthContext/AuthContext';
import {useSocket} from '../../context/SocketContext/SocketContext';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useFriend from '../../hooks/useFriend';
import './home.css';

const Home = () => {
	const axiosPrivate = useAxiosPrivate();

	const {socket} = useSocket();
	const {user, dispatch} = useAuth();
	const [active, setActive] = useState(false);
	const [isSearch, setIsSearch] = useState(false);
	const [searchInput, setSearch] = useState('');
	const inputElement = useRef();
	const [show, setShow] = useState(false);
	const [notification, setNotification] = useState([]);
	const [index, setindex] = useState(1);
	const {friends, setfriend, isFetching, error, hasMore} = useFriend(index, active, isSearch, searchInput);
	const skeletonFriends = [0, 1, 2, 3, 4];
	const friendsRef = useRef(null);
	useEffect(() => {
		fetchAllNotification(axiosPrivate).then((data) => {
			data && data.length !== 0 && setNotification(data);
		});
	}, [axiosPrivate]);

	useEffect(() => {
		friendsRef.current = friends;
	}, [friends]);

	// For the Pagination
	const intObserver = useRef();
	const lastfriendRef = useCallback(
		(friend) => {
			if (isFetching) return;
			if (intObserver.current) intObserver.current.disconnect();
			intObserver.current = new IntersectionObserver((friends) => {
				if (friends[0].isIntersecting && hasMore) {
					setindex((prev) => prev + 1);
				}
			});
			if (friend) intObserver.current.observe(friend);
		},
		[isFetching, hasMore]
	);

	useEffect(() => {
		if (!socket) return;
		socket.on('getMessage', (data) => {
			const sender = friendsRef.current.find((f) => parseInt(f.user_id) === parseInt(data.sender_id));
			setNotification((prev) => [...prev, data]);
			if (!sender) {
				console.log('fetch friend');
				getFriend(axiosPrivate, data.sender_id, dispatch).then((friend) => {
					friend && setfriend((list) => [friend, ...list]);
				});
			}
		});

		return () => {
			socket?.off('getMessage');
		};
		// eslint-disable-next-line
	}, [socket]);

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

					{!isFetching
						? friends.map((f, i) => {
								if (friends.length === i + 1) {
									return (
										<div key={f.user_id} ref={lastfriendRef}>
											<Friend notifi={notification} friend={f} />
										</div>
									);
								}
								return <Friend key={f.user_id} notifi={notification} friend={f} />;
						  })
						: skeletonFriends.map((i) => {
								return <FriendSkeleton key={i} />;
						  })}
				</div>
			</section>
		</div>
	);
};

export default memo(Home);
