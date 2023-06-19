import { CircularProgress } from '@material-ui/core';
import { Cancel, PermMedia } from '@material-ui/icons';
import React, { useContext, useRef, useState, useEffect } from 'react'
import { getSignRequest, uploadFile, userUpdateCall, clearError } from '../apiCalls';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';

const validFileType = ["image/png", "image/jpg", "image/jpeg"];

export default function Update({toggleFrame, toggleWarning}) {

    const { user, isFetching, error, dispatch} = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [signedRequest, setsignedRequest] = useState(null);
    const fname = useRef();
    const lname = useRef();
    const email = useRef();
    const password = useRef();
    const [isActive, setisActive] = useState(false);
    const [severError, setSeverError] = useState(null);
    

    useEffect(() => {
        clearError(dispatch);
    }, [dispatch]);

    const handleSubmit = (e) =>{
        e.preventDefault();
        const data =  {
            user_id: user.user_id
        }
        fname.current.value && (data.fname = fname.current.value.trim());
        lname.current.value && (data.lname = lname.current.value.trim());
        email.current.value && (data.email = email.current.value.trim());
        password.current.value && (data.password = password.current.value.trim());
        file && (data.profil_pic = encodeURIComponent(file.name));

        if(signedRequest!==null && file!==null){
            uploadFile(file, signedRequest, dispatch).then((res) =>{
                if(res===200){
                    userUpdateCall(data, dispatch).then((res) =>{
                        !res && toggleFrame();
                        setTimeout(() =>{
                            clearError(dispatch);
                        },5000);
                    }).catch(() =>{
                        setSeverError("Sever does not give any response!");
                        setTimeout(() =>{
                            setSeverError(null);
                        },5000);
                        clearError(dispatch);
                    });
                }else{
                    setSeverError("Image does not upload to the Server!");
                    setTimeout(() =>{
                        setSeverError(null);
                    },5000);
                    clearError(dispatch);
                    setFile(null);
                    setsignedRequest(null);
                }
            }).catch(() =>{
                setSeverError("Sever does not give any response!");
                setTimeout(() =>{
                    setSeverError(null);
                },5000);
                clearError(dispatch);
                setFile(null);
                setsignedRequest(null);
            });
        }else if(data.email || data.password || data.fname || data.lname){
            userUpdateCall(data, dispatch).then((res) =>{
                !res && toggleFrame();
                setTimeout(() =>{
                    clearError(dispatch);
                },5000);
            }).catch(() =>{
                setSeverError("Sever does not give any response!");
                setTimeout(() =>{
                    setSeverError(null);
                },5000);
                clearError(dispatch);
            });
        }
    }

    const handleFile = (file) =>{
        if(file){
            if(!validFileType.find(type => type === file.type)){
                setSeverError("File must be in jpg, png or jpeg format");
                setTimeout(() =>{
                    setSeverError(null);
                },5000);
                return;
            }
            setFile(file);
            getSignRequest(file).then(res =>{
                setsignedRequest(res.signedRequest);
            }).catch(err =>{
                setSeverError("Sever does not give any response!");
                setTimeout(() =>{
                    setSeverError(null);
                },5000);
            });
        }
    }

    return (
        <> 
            <Header user={user} toggleFrame={toggleFrame} toggleWarning={toggleWarning}/>
            <span><strong>Update Details</strong></span>
            <form onSubmit={handleSubmit} autoComplete="off" >
                {error && <div className="error-txt">{error}</div>}
                {severError && <div className="error-txt">{severError}</div>}
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
                    <div className="shareOption" >
                        <label className="buttonImg" htmlFor="file" >
                            <PermMedia htmlColor="tomato" className="shareIcon" />
                            <span className="shareOptionText">Photo</span>
                            <input style={{display:"none"}} type="file" id="file" onChange={(e) => handleFile(e.target.files[0])} />
                        </label>
                        {file && (<div className="uploadPhoto" >
                            <img src={URL.createObjectURL(file)} alt="selectedImg" />
                            <Cancel className="cancelImg" onClick={() => setFile(null)} />
                        </div>)}
                    </div>
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
