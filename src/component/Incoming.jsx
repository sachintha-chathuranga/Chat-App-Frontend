const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Incoming({msg, profil_pic}) {
    return (
        <div className="chat incoming">
            <img src={PF+profil_pic} alt="" />
            <div className="details">
                <p>{msg}</p>
            </div>
        </div>
    )
}
