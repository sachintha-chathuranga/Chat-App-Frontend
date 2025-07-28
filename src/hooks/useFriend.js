import {useEffect, useState} from 'react';
import {fetchFriendList, searchFriend} from '../apiCalls';
import useAxiosPrivate from './useAxiosPrivate';

const useFriend = (index, active, isSearch, searchInput) => {
	const [friends, setfriend] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [error, seterror] = useState(null);
	const [hasMore, sethasMore] = useState(true);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		//appending to current friendlist
		if (friends.length >= 15) {
			setIsFetching(true);
			isSearch
				? searchFriend(axiosPrivate, index, searchInput)
						.then((d) => {
							setfriend((prev) => [...prev, ...d]);
							sethasMore(Boolean(d.length));
							setIsFetching(false);
						})
						.catch((e) => {
							if (!e?.response) {
								seterror('No Sever Response');
							} else if (e.response?.data) {
								seterror(e.response.data);
							} else {
								seterror('You are currently offline. Check your internet Connection!');
							}
							setIsFetching(false);
						})
				: fetchFriendList(axiosPrivate, index)
						.then((d) => {
							setfriend((prev) => [...prev, ...d]);
							sethasMore(Boolean(d.length === 15));
							setIsFetching(false);
						})
						.catch((e) => {
							if (!e?.response) {
								seterror('No Sever Response');
							} else if (e.response?.data) {
								seterror(e.response.data);
							} else {
								seterror('You are currently offline. Check your internet Connection!');
							}
							setIsFetching(false);
						});
		}
		// eslint-disable-next-line
	}, [index]);

	// search or get recent users
	useEffect(() => {
		setIsFetching(true);
		isSearch
			? searchFriend(axiosPrivate, null, searchInput)
					.then((d) => {
						setfriend(d);
						setIsFetching(false);
					})
					.catch((e) => {
						if (!e?.response) {
							seterror('No Sever Response');
						} else if (e.response?.data) {
							seterror(e.response.data);
						} else {
							seterror('You are currently offline. Check your internet Connection!');
						}
						setIsFetching(false);
					})
			: fetchFriendList(axiosPrivate, null)
					.then((d) => {
						setfriend(d);
						setIsFetching(false);
					})
					.catch((e) => {
						if (!e?.response) {
							seterror('No Sever Response');
						} else if (e.response?.data) {
							seterror(e.response.data);
						} else {
							seterror('You are currently offline. Check your internet Connection!');
						}
						setIsFetching(false);
					});
		// eslint-disable-next-line
	}, [active, axiosPrivate]);

	return {friends, setfriend, isFetching, error, hasMore};
};

export default useFriend;
