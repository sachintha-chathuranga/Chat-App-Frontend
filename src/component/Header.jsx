import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Header(props) {
    
    
    const history = useHistory();
    const handleBack = () =>{
        if(props.hasOwnProperty('toggleFrame')){
            props.toggleFrame();
        }else{
            history.push('/');
        }
    }
    return (
        <header>
            <div className="content">
                <div className="back-icon" onClick={handleBack}><i className="fas fa-arrow-left"></i></div>
                <img src={props.user.profil_pic && PF + props.user.profil_pic } alt="proPic" />
                <div className="details">
                    <span>{props.user.fname +" "+ props.user.lname}</span>
                    <p>{props.user.status ? "Online" : "Offline"}</p>
                </div>
            </div>
            <button onClick={() => props.toggleWarning()} className="delete">Delete</button>
            
        </header>
    )
}
