import { CircularProgress } from '@material-ui/core';
import { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { clearError, loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
    
    const email = useRef();
    const password = useRef();
    const [isActive, setisActive] = useState(false);
    const [severError, setSeverError] = useState(null);
    const { isFetching, error, dispatch} = useContext(AuthContext);
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        loginCall({email: email.current.value.trim(), password: password.current.value.trim()}, dispatch).then(res =>{
            if(res!==200){
                setTimeout(() =>{
                    clearError(dispatch);
                },5000);
            }
        }).catch(err =>{
            setSeverError("Sever does not give any response!");
            setTimeout(() =>{
                setSeverError(null);
            },5000);
            clearError(dispatch);
        });
        
    }

    return (
        <div className="wrapper">
            <section className="form login">
                <header>Bliss Talk</header>
                <form onSubmit={handleSubmit} autoComplete="off">
                    {error && <div className="error-txt">{error}</div>}
                    {severError && <div className="error-txt">{severError}</div>}
                    
                        <div className="field input">
                            <label>Email Address</label>
                            <input type="email" ref={email} placeholder="Enter your email" required/>
                        </div>
                        <div className="field input">
                            <label>Password</label>
                            <input type={isActive ? "text" : "password"} ref={password} placeholder="Enter your password" required/>
                            <i className={isActive ? "fas fa-eye active" : "fas fa-eye"} onClick={() => setisActive(!isActive)} ></i>
                        </div>
                        <div className="field button">
                            <button type="submit"  className="loginBtn" disabled={isFetching}>
                                {isFetching ? <CircularProgress style={{color: "white", width: "30px", height: "30px"}} /> : "Login"}
                            </button>
                        </div>
                </form>
                <div className="link">Not yet signed up? <Link to="/signUp">Signup </Link>now</div>
            </section>
        </div> 
    )
}
