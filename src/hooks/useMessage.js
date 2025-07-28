import {useEffect, useState} from 'react';
import {fetchMessages} from '../apiCalls';
import useAxiosPrivate from './useAxiosPrivate';

const useMessage = (friend_id, scrolltoBottom) => {
	const [isMount, setisMount] = useState(true);
	const [messages, setMessages] = useState([]);
	const [error, seterror] = useState(null);
	const [isMessageFetching, setIsMessageFeting] = useState(false);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		setIsMessageFeting(true);
		fetchMessages(axiosPrivate, friend_id)
			.then((d) => {
				setIsMessageFeting(false);
				isMount && setMessages(d);
				scrolltoBottom();
			})
			.catch((e) => {
				if (!e?.response) {
					setIsMessageFeting(false)
					isMount && seterror('No Sever Response');
				} else if (e.response?.data) {
					setIsMessageFeting(false)
					isMount && seterror(e.response.data);
				} else {
					setIsMessageFeting(false)
					isMount && seterror('You are currently offline. Check your internet Connection!');
				}
			})
		return () => {
			setisMount(false);
		};
	}, [friend_id, scrolltoBottom, axiosPrivate, isMount]);

	return {messages, setMessages, error, isMessageFetching};
};

export default useMessage;
