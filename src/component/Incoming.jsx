const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

export default function Incoming({msg, profil_pic}) {
    return (
        <div className="chat incoming">
            <img src={profil_pic ? imageUrl+profil_pic : PF+"default.png"} alt="proPic" />
            <div className="details">
                <p>{msg}</p>
            </div>
        </div>
    )
}
