import {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import {useAuth} from '../AuthContext/AuthContext';
const SOCKET_URL = process.env.REACT_APP_API_SOCKET_URL;

const SocketContext = createContext();

const SocketContextProvider = ({children}) => {
	const {user} = useAuth();
	const [socket, setSocket] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	// Keep the latest token available to the socket
	const tokenRef = useRef(user?.access_token);

	tokenRef.current = user?.access_token;

	const connectSocket = useCallback(() => {
		if (!user?.access_token) return;
		// Prevent duplicate connections
		if (socket?.connected) return;
		console.log('ConnectSocket Called');

		// Disconnect an old socket if necessary
		socket?.disconnect();
		socket?.removeAllListeners();

		const newSocket = io(SOCKET_URL, {
			autoConnect: false,
			auth: (callback) => {
				callback({
					token: tokenRef.current,
				});
			},
			transports: ['websocket'],
			reconnection: true,
			reconnectionAttempts: 2,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});

		newSocket.on('connect', () => {
			console.log('Socket connected:', newSocket.id);
			setIsConnected(true);
		});
		newSocket.on('disconnect', (reason) => {
			console.log('Socket disconnected:', reason);
			setIsConnected(false);
		});
		newSocket.on('connect_error', (error) => {
			console.log('Socket connection error:', error.message);
			setIsConnected(false);
		});
		setSocket(newSocket);
		newSocket.connect();
		// eslint-disable-next-line
	}, [user, user?.access_token]);

	const disconnectSocket = useCallback(() => {
		if (!socket) return;
		console.log('DisconnectSocket Called');

		socket.disconnect();
		socket.removeAllListeners();
		setSocket(null);
		setIsConnected(false);

		// eslint-disable-next-line
	}, [socket]);

	// Connect when authenticated
	useEffect(() => {
		if (user?.access_token) {
			connectSocket();
		} else {
			disconnectSocket();
		}
		// eslint-disable-next-line
	}, [user,user?.accessToken]);

	return (
		<SocketContext.Provider value={{socket, isConnected, connectSocket, disconnectSocket}}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = SocketContextProvider;
