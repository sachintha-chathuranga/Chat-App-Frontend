import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {AuthProvider} from './context/AuthContext/AuthContext';
import {SocketProvider} from './context/SocketContext/SocketContext';
import {VideoCallProvider} from './context/VideoCallContext/VideoCallContext';
import './index.css';
import reportWebVitals from './reportWebVitals';
import process from 'process';
window.process = process;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
		<AuthProvider>
			<SocketProvider>
				<VideoCallProvider>
					<App />
				</VideoCallProvider>
			</SocketProvider>
		</AuthProvider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
