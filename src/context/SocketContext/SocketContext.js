import {createContext, memo, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {io} from 'socket.io-client';
import {useAuth} from '../AuthContext/AuthContext';
const API_URL = process.env.REACT_APP_API_SOCKET_URL;

const SocketContext = createContext();

const SocketContextProvider = ({children}) => {
	console.log('Socket Context render');
	const {user} = useAuth();
	const [socket, setSocket] = useState(null);

	const connectSocket = useCallback(
		(userId) => {
			if (!socket) {
				console.log(socket);
				const newSocket = io(API_URL);
				newSocket.on('connect', () => {
					console.log('Socket Connected');
					newSocket?.emit('joinRoom', userId);
				});
				newSocket.on('disconnect', () => {
					console.log('Socket disconnected');
				});
				newSocket.on('error', (error) => {
					console.error('Socket error:', error);
				});
				setSocket(newSocket);
			}
			// eslint-disable-next-line
		},
		[socket]
	);

	const disconnectSocket = useCallback(() => {
		if (socket) {
			socket.emit('leaveRoom', user?.user_id);
			socket.disconnect();
			setSocket(null);
		}
		// eslint-disable-next-line
	}, [socket, user?.user_id]);

	useEffect(() => {
		if (user?.user_id) {
			connectSocket(user?.user_id);
		}
	}, [user?.user_id, connectSocket]);

	const values = useMemo(
		() => ({
			socket,
			connectSocket,
			disconnectSocket,
		}),
		[socket, connectSocket, disconnectSocket]
	);
	return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = memo(SocketContextProvider);
