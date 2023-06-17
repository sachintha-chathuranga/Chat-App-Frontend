
import { CircularProgress } from '@material-ui/core';
import { PermMedia } from '@material-ui/icons';
import React, { useContext, useRef, useState } from 'react'
import { userUpdateCall } from '../apiCalls';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';

export default function Update({toggleFrame, toggleWarning}) {

    const { user, isFetching, error, dispatch} = useContext(AuthContext);
    const [file, setFile] = useState({});
    const fname = useRef();
    const lname = useRef();
    const email = useRef();
    const password = useRef();
    const [isActive, setisActive] = useState(false);

    const handleSubmit = (e) =>{
        e.preventDefault();
        const data =  {
            user_id: user.user_id
        }
        fname.current.value && (data.fname = fname.current.value.trim());
        lname.current.value && (data.lname = lname.current.value.trim());
        email.current.value && (data.email = email.current.value.trim());
        password.current.value && (data.password = password.current.value.trim());
        file && (data.profil_pic = file.name);

        userUpdateCall(data, dispatch).catch(err =>{
            alert(err);
            window.location.reload();
        });
    }
    return (
        <> 
            <Header user={user} toggleFrame={toggleFrame} toggleWarning={toggleWarning}/>
            <span><strong>Update Details</strong></span>
            <form onSubmit={handleSubmit} autoComplete="off" >
                {error && <div className="error-txt">{error}</div>}
                <div className="name-details">
                    <div className="field input">
                        <label>First Name</label>
                        <input  type="text" ref={fname} placeholder={user.fname} minLength="3" maxLength="15" pattern="[A-Za-z]+" title="Please enter only alphabetic characters!" />
                    </div>
                    <div className="field input">
                        <label>Last Name</label>
                        <input type="text" ref={lname} placeholder={user.lname} minLength="3" maxLength="15" pattern="[A-Za-z]+" title="Please enter only alphabetic characters!" />
                    </div>
                </div>
                <div className="field input">
                    <label>Email Address</label>
                    <input type="email" ref={email} placeholder={user.email} />
                </div>
                <div className="field input">
                    <label>Password</label>
                    <input type={isActive ? "text" : "password"} ref={password} placeholder="Enter new password" />
                    <i className={isActive ? "fas fa-eye active" : "fas fa-eye"} onClick={() => setisActive(!isActive)} ></i>
                </div>
                <div className="field image">
                    <label>Change Profile picture</label>
                    <label htmlFor="file" className="shareOption">
                        <PermMedia htmlColor="tomato" className="shareIcon" />
                        <span className="shareOptionText">Photo</span>
                        <input style={{display:"none"}} type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                </div>
                <div className="field button">
                    <button type="submit"  className="loginBtn" disabled={isFetching}>
                        {isFetching ? <CircularProgress style={{color:"white", width: "26px", height: "26px"}}/> : "Save Changes"}
                    </button>
                </div>
            </form>
        </>
    )
}
