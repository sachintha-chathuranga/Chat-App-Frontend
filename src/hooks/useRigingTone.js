import {useCallback, useEffect, useRef} from 'react';

const useRigingTone = () => {
	const incommingAudioRef = useRef(null);
	const outgoingAudioRef = useRef(null);

	useEffect(() => {
		console.log('Create new Audio');
		// Create audio object once
		incommingAudioRef.current = new Audio('/sounds/Sony-Xperia.mp3'); // place ringtone in public/sounds
		incommingAudioRef.current.loop = true; // make it loop until stopped

		return () => {
			if (incommingAudioRef.current) {
				incommingAudioRef.current.pause();
				incommingAudioRef.current.src = ''; // release the file
				incommingAudioRef.current = null; // remove reference
			}
		};
	}, []);
	useEffect(() => {
		console.log('Create new Audio');
		// Create audio object once
		outgoingAudioRef.current = new Audio('/sounds/hangouts_outgoing.mp3'); // place ringtone in public/sounds
		outgoingAudioRef.current.loop = true; // make it loop until stopped

		return () => {
			if (outgoingAudioRef.current) {
				outgoingAudioRef.current.pause();
				outgoingAudioRef.current.src = ''; // release the file
				outgoingAudioRef.current = null; // remove reference
			}
		};
	}, []);

	const playincommingRingtone = useCallback(() => {
		if (incommingAudioRef.current) {
			incommingAudioRef.current.play().catch((err) => {
				console.warn('Autoplay prevented. User interaction needed.', err);
			});
		}
	}, []);

	const stopIncommingRingtone = useCallback(() => {
		if (incommingAudioRef.current) {
			incommingAudioRef.current.pause();
			incommingAudioRef.current.currentTime = 0;
		}
	}, []);
	const playOutgoingRingtone = useCallback(() => {
		if (outgoingAudioRef.current) {
			outgoingAudioRef.current.play().catch((err) => {
				console.warn('Autoplay prevented. User interaction needed.', err);
			});
		}
	}, []);

	const stopOutgoingRingtone = useCallback(() => {
		if (outgoingAudioRef.current) {
			outgoingAudioRef.current.pause();
			outgoingAudioRef.current.currentTime = 0;
		}
	}, []);

	return {playincommingRingtone, stopIncommingRingtone, playOutgoingRingtone, stopOutgoingRingtone};
};

export default useRigingTone;
