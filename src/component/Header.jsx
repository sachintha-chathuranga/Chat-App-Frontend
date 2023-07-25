import { memo } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { clearMessages } from '../apiCalls';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

const Header = (props) => {
    const history = useHistory();

    const handleBack = () =>{
        if(props.hasOwnProperty('toggleFrame')){
            props.toggleFrame();
        }else{
            history.push('/');
        }
    }

    const handleButton = () =>{
        if(props.hasOwnProperty('toggleWarning')){
            props.toggleWarning();
        }else{
            props.isEmpty && clearMessages(props.user.user_id, props.logUserId);
        }
    }
    
    return (
        <header>
            <div className="content">
                <div className="back-icon" onClick={handleBack}><i className="fas fa-arrow-left"></i></div>
                <img src={props.user.profil_pic ? imageUrl+props.user.profil_pic : PF + "default.png" } alt="proPic" />
                <div className="details">
                    <span>{props.user.fname +" "+ props.user.lname}</span>
                    <p>{props.user.status ? "Online" : "Offline"}</p>
                </div>
            </div>
            <button onClick={() => handleButton()} className="delete">{props.hasOwnProperty('logUserId') ? "Clear Chat" : "Delete Account"}</button>
        </header>
    )
}

export default memo(Header);