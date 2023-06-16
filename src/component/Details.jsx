import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import Header from './Header'

export default function Details({toggleFrame, toggleWarning}) {

    const {user} = useContext(AuthContext);
    
    return (
        <>  
            <Header user={user} toggleWarning={toggleWarning} />
            <span><strong>Account Details</strong></span>
            <div id="info" >
                <div className="account-details">
                    <div className="field">
                        <label >Full Name </label>:
                        <span> {user.fname +" "+ user.lname}</span>
                    </div>
                    <div className="field">
                        <label >Email </label>:
                        <span> {user.email}</span>
                    </div>
                </div>
                <footer>
                    <div onClick={() => toggleFrame()} className="change-btn">Change information</div>
                </footer>
            </div>
        </>
    )
}
