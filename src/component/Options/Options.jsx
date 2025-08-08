import {Button, Container, Grid2, Paper, TextField, Typography} from '@mui/material';
import React, {useContext, useState} from 'react';
import {SocketContext} from '../../SocketContext';
import './options.css';
const Options = ({children}) => {
	const {me, callAccepted, name, setName, callEnded, leaveCall, callUser} = useContext(SocketContext);
  console.log("socket ID: "+me)
	const [idToCall, setIdToCall] = useState('');

	return (
		<Container className="container">
			<Paper elevation={10} className="paper">
				<form className="root" noValidate autoComplete="off">
					<Grid2  xs={12} md={6} className="padding">
						<Typography gutterBottom variant="h6">
							Account Info
						</Typography>
						<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
						<p>ID: {me}</p>
					</Grid2>
					<Grid2  xs={12} md={6} className="padding">
						<Typography gutterBottom variant="h6">
							Make a call
						</Typography>
						<TextField
							label="ID to call"
							value={idToCall}
							onChange={(e) => setIdToCall(e.target.value)}
							fullWidth
						/>
						{callAccepted && !callEnded ? (
							<Button variant="contained" color="secondary" fullWidth onClick={leaveCall} className="margin">
								{' '}
								Hang Up
							</Button>
						) : (
							<Button
								variant="contained"
								color="primary"
								fullWidth
								onClick={() => callUser(idToCall)}
								className="margin"
							>
								Call
							</Button>
						)}
					</Grid2>
				</form>
        {children}
			</Paper>
		</Container>
	);
};

export default Options;
