import { memo } from 'react';

const Incoming = ({isLoading, msg, profil_pic }) => {
	return (
		<div className="chat incoming">
			<div className="details">
				{!isLoading ? <p>{msg}</p> : <div className='income-msg skeleton'></div> }
			</div>
		</div>
	);
};

export default memo(Incoming);
