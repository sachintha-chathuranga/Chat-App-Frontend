import { useRef, memo } from "react";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Incoming = ({msg, profil_pic}) => {
    const msgs = useRef(msg);
    if(msgs.current.match(/^[\da-fA-F]{4,5}$/)){
        let emoji = msgs.current.padStart(5,'O');
        emoji = String.fromCharCode(parseInt(emoji, 16));
        msgs.current = emoji;
    }
    return (
        <div className="chat incoming">
            <img src={profil_pic ? imageUrl+profil_pic : PF+"default.png"} alt="proPic" />
            <div className="details">
                <p>{msgs.current}</p>
            </div>
        </div>
    )
}

export default memo(Incoming);