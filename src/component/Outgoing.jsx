import { memo } from "react";

const Outgoing = ({msg}) => {
    return (
        <div className="chat outgoing">
            <div className="details">
                <p>{msg}</p>
            </div>
        </div>
    )
}

export default memo(Outgoing);