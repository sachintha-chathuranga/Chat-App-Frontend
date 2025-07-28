import React, {memo} from 'react';
import "./friendSkeleton.css"
const FriendSkeleton = () => {
	return (
		<div className="friend-skeleton background-skeleton">
			<div className="content">
				<div className="img skeleton"> </div>
				<div className="text-wrapper">
					<div className="text-1 skeleton"> </div>
					<div className="text-2 skeleton"></div>
				</div>
			</div>
			<div className="right-side">
				<div className="skeleton-dot skeleton"></div>
				<div className="text-2 skeleton"></div>
			</div>
		</div>
	);
};

export default memo(FriendSkeleton);
