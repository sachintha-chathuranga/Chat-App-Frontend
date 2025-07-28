import {DarkModeOutlined, LightModeOutlined} from '@mui/icons-material';
import React, {memo, useEffect, useState} from 'react';

function ThemeButton({setShow,type}) {
	const [theme, setTheme] = useState(() => localStorage.getItem('darkmode') || false);

	useEffect(() => {
		document.body.className = theme ? 'darkmode' : '';
	}, [theme]);

	const toggleTheme = () => {
		setShow && setShow(false);
		setTheme((theme) => !theme);
		if (!theme) {
			localStorage.setItem('darkmode', !theme);
		} else {
			localStorage.removeItem('darkmode');
		}
	};

	const darkStyle = {
		color: 'yellow',
		background: 'radial-gradient(circle, yellow -32% , transparent 74%)',
	};
	const lightStyle = {
		color: '#4317c3',
		background: 'radial-gradient(circle, #00000014 100% , transparent 74%)',
	};
	const noStyle = {
		color: 'var(--text-color)',
	};
	return (
		<>
			<div
				id="theme-switch"
				style={type === 'outside' ? (theme ? darkStyle : lightStyle) : noStyle}
				className={type === 'header' ? 'item' : ''}
				onClick={() => toggleTheme()}
			>
				{theme ? <LightModeOutlined /> : <DarkModeOutlined />}
				{type === 'header' ? (theme ? 'Light mode' : 'Dark mode') : ''}
			</div>
		</>
	);
}

export default memo(ThemeButton);
