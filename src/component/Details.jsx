import React, { useContext, memo } from 'react'
import { AuthContext } from '../context/AuthContext';
import Header from './Header'

function Details({toggleFrame, toggleWarning}) {
    const {user} = useContext(AuthContext);
    
    return (
        <>  
            <Header user={user} toggleWarning={toggleWarning} />
            <span><strong>Account Details</strong></span>
            <div id="info" >
                <div className="account-details">
                    <div className="field">
                        <label>Name </label>:
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

export default memo(Details);