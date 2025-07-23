import React, { memo, useEffect, useState } from 'react';

function ThemeButton() {
	const [theme, setTheme] = useState(() => {
		// Get theme from localStorage or default to 'light'
		return localStorage.getItem('darkmode') || false;
	});
	useEffect(() => {
		// Apply theme class to <body> or <html>
		document.body.className = theme ? 'darkmode' : '';

		// Store the theme in localStorage
		localStorage.setItem('darkmode', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((theme) => !theme);
		localStorage.setItem('darkmode', !theme);
	};
	return (
		<>
			<button
				id="theme-switch"
				style={{
					color: theme ? 'yellow' : '#4317c3',
					background: `radial-gradient(circle, ${
						theme ? 'yellow' : '#00000014'
					} ${theme ? '-32%' : '100%'}, transparent 74%)`,
				}}
				onClick={() => toggleTheme()}
			>
				<span class="material-symbols-outlined">
					{theme ? 'light_mode' : 'dark_mode'}
				</span>
			</button>
		</>
	);
}

export default memo(ThemeButton);
