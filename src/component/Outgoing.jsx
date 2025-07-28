import { memo} from "react";

const Outgoing = ({isLoading,msg}) => {
    
    return (
        <div className="chat outgoing">
            <div className="details">
                {!isLoading ? <p>{msg}</p> : <div className="outgoing-msg skeleton"></div> }
            </div>
        </div>
    )
}

export default memo(Outgoing);