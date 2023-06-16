import React, { useContext, useState } from 'react'
import { clearError } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import Details from '../../component/Details';
import Update from '../../component/Update';
import Warnnig from '../../component/Warnnig';
import './profile.css';

export default function Profile() {

    const {dispatch} = useContext(AuthContext);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isWarning, setisWarning] = useState(false);
    
    const toggleFrame = () =>{
        setIsUpdate(!isUpdate);
        clearError(dispatch);
    }

    const toggleWarning = () =>{
        setisWarning(!isWarning);
        clearError(dispatch);
    }

    return (
        <div className="wrapper">
            <section className="profile">
                {!isWarning ? (isUpdate ? <Update toggleFrame={toggleFrame} toggleWarning={toggleWarning} /> :
                <Details toggleFrame={toggleFrame} toggleWarning={toggleWarning} />) :
                <Warnnig toggleWarning={toggleWarning} />}
            </section>
        </div>
    )
}
