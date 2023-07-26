import { memo, useRef } from "react";

const Outgoing = ({msg}) => {
    console.log(typeof(msg));
    const msgs = useRef(msg);
    if(msgs.current.match(/^[\da-fA-F]{4,5}$/)){
        let emoji = msgs.current.padStart(5,'O');
        emoji = String.fromCharCode(parseInt(emoji, 16));
        msgs.current = emoji;
    }
    return (
        <div className="chat outgoing">
            <div className="details">
                <p>{msgs.current}</p>
            </div>
        </div>
    )
}

export default memo(Outgoing);