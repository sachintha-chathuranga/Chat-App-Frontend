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
	const privateApi = useAxiosPrivate();

	const {socket, isConnected} = useSocket();
	const {user} = useAuth();
	const [active, setActive] = useState(false);
	const [isSearch, setIsSearch] = useState(false);
	const [searchInput, setSearch] = useState('');
	const inputElement = useRef();
	const [show, setShow] = useState(false);
	const [notification, setNotification] = useState([]);
	const [index, setindex] = useState(1);
	const {friends, setfriend, isFetching, error, sethasMore, hasMore} = useFriend(index, active, isSearch, searchInput);
	const skeletonFriends = [0, 1, 2, 3, 4];
	const friendsRef = useRef(null);
	useEffect(() => {
		fetchAllNotification(privateApi).then((data) => {
			data && data.length !== 0 && setNotification(data);
		});
	}, [privateApi]);

	useEffect(() => {
		friendsRef.current = friends;
	}, [friends]);

	// For the Pagination
	const intObserver = useRef();
	const lastfriendRef = useCallback(
		(friend) => {
			if (isFetching) return;
			if (intObserver.current) {
				intObserver.current.disconnect();
			}
			intObserver.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && hasMore && !isFetching) {
						setindex((prev) => prev + 1);
					}
				},
				{
					root: null,
					rootMargin: '100px',
					threshold: 0,
				}
			);
			if (friend) {
				intObserver.current.observe(friend);
			}
		},
		[isFetching, hasMore]
	);

	useEffect(() => {
		console.log('Socket At Home: ' + socket);
		if (!socket || !isConnected) return;
		console.log('HomeScreen getMessage listening...');
		const handleMessage = (data) => {
			console.log('Message Comming Background');
			const sender = friendsRef.current.find((f) => parseInt(f.user_id) === parseInt(data.sender_id));
			setNotification((prev) => [...prev, data]);
			if (!sender) {
				console.log('fetch friend');
				getFriend(privateApi, data.sender_id).then((friend) => {
					friend && setfriend((list) => [friend, ...list]);
				});
			}
		};
		socket.on('getMessage', handleMessage);

		return () => {
			console.log('Home getMessage listner Off');
			socket?.off('getMessage', handleMessage);
		};
		// eslint-disable-next-line
	}, [socket, isConnected]);

	const fetchFriendList = () => {
		setfriend([]);
		sethasMore(true);
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
			<section className="home" onClick={() => show && setShow(false)}>
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
