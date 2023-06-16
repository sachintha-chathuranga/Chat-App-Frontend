import { useState, useRef, useContext, useEffect } from "react"
import { Link, useHistory } from "react-router-dom";
import { clearError, signUpCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

function SignUp() {
   
    const {isFetching, error, dispatch} = useContext(AuthContext);
    const fname = useRef();
    const lname = useRef();
    const email = useRef();
    const password = useRef();
    const [isActive, setisActive] = useState(false);
    const history = useHistory();

    useEffect(() => {
        clearError(dispatch);
    }, [dispatch]);

    const handleSubmit = (e) =>{
        e.preventDefault();
        const user =  {
            fname: fname.current.value,
            lname: lname.current.value,
            email: email.current.value,
            password: password.current.value
        }
        signUpCall(user, dispatch).then(res =>{
            !res && history.push('/login');
        }).catch(err =>{
            alert(err);
            window.location.reload();
        });
    }

    return (
        <div className="wrapper">
            <section className="form signup">
                <header>Bliss Talk</header>
                <form onSubmit={handleSubmit} autoComplete="off">
                    {error && <div className="error-txt">{error}</div>}
                    <div className="name-details">
                            <div className="field input">
                                <label>First Name</label>
                                <input  type="text" ref={fname} placeholder="First Name" required minLength="3" maxLength="15" pattern="[A-Za-z]+" title="Please enter only alphabetic characters!"/>
                            </div>
                            <div className="field input">
                                <label>Last Name</label>
                                <input type="text" ref={lname} placeholder="Last Name" required minLength="3" maxLength="15" pattern="[A-Za-z]+" title="Please enter only alphabetic characters!"/>
                            </div>
                        </div>
                        <div className="field input">
                            <label>Email Address</label>
                            <input type="text" ref={email} placeholder="Enter your email" required />
                        </div>
                        <div className="field input">
                            <label>Password</label>
                            <input type={isActive ? "text" : "password"} ref={password} placeholder="Enter new password" required />
                            <i className={isActive ? "fas fa-eye active" : "fas fa-eye"} onClick={() => setisActive(!isActive)} ></i>
                        </div>
                       
                        <div className="field button">
                            <button type="submit"  className="loginBtn" disabled={isFetching}>
                                {isFetching ? <CircularProgress style={{color: "white", width: "30px", height: "30px"}}/> : "Sign UP"}
                            </button>
                        </div>
                </form>
                <div className="link">Already signed up? <Link to="/login">Login now</Link></div>
            </section>
        </div>
    );
}

export default SignUp;



