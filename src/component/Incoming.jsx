import { memo } from 'react';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Incoming = ({isLoading, msg, profil_pic }) => {
	return (
		<div className="chat incoming">
			{ !isLoading ? <img
				src={profil_pic ? imageUrl + profil_pic : PF + 'default.png'}
				alt="proPic"
			/> : <div className="img skeleton"></div> }
			<div className="details">
				{!isLoading ? <p>{msg}</p> : <div className='income-msg skeleton'></div> }
			</div>
		</div>
	);
};

export default memo(Incoming);
