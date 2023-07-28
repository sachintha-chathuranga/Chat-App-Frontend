import { MoreVert } from "@material-ui/icons";
import React, { useContext, useRef, useState, useCallback } from 'react'
import { AuthContext } from '../../context/AuthContext';
import Friend from '../../component/Friend';
import { clearError, logOutCall } from '../../apiCalls';
import './home.css';
import { CircularProgress } from '@material-ui/core';
import useFriend from '../../hooks/useFriend';
import { Link } from 'react-router-dom';
import { memo } from "react";

const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;
const Home = () =>{
    const {user, dispatch} = useContext(AuthContext);
    const [active, setActive] = useState(false);
    const [searchInput, setSearch] = useState("");
    const inputElement = useRef();
    const [show, setShow] = useState(false);

    const [index, setindex] = useState(1);
    const { friends, setfriend, isLoading, error, hasMore } = useFriend(index, user.user_id, active, searchInput);
    
    const intObserver = useRef();
    const lastfriendRef = useCallback(friend => {
        if(isLoading) return
        if(intObserver.current) intObserver.current.disconnect();
        intObserver.current = new IntersectionObserver(friends => {
            if(friends[0].isIntersecting && hasMore){
                setindex(prev => prev +1);
            }
        });
        if(friend) intObserver.current.observe(friend);
    },[isLoading, hasMore]);

    const activeSearch = () =>{
        setfriend([]);
        setActive(!active);
        setSearch("");
        setindex(1);
        inputElement.current.focus();
    }

    return (
        <div className="wrapper" >
            <section className="users">
                <header>
                    <div className="content">
                        <img src={user.profil_pic ? imageUrl+user.profil_pic : PF + "default.png" } alt="proPic" />
                        <div className="details">
                            <span>{user.fname +" "+ user.lname}</span>
                            <p>{user.status ? "Online" : "Offline"}</p>
                        </div>
                    </div>
                    <div className="dropdown">
                        <div className="dropbtn"><MoreVert onClick={() => setShow(!show)} style={{fontSize: "1.8rem"}} /></div>
                        <div id="myDropdown" className={show ? "dropdown-content show" : "dropdown-content"}>
                            <Link to={"/profile"}>
                                <div className="prof">Proflie</div>
                            </Link>
                            <div onClick={() => logOutCall({user_id: user.user_id, status: false}, dispatch).then(res => res!==200 && setTimeout(() =>{ clearError(dispatch);},5000))} className="logout">Logout</div>
                        </div>
                    </div>
                </header>
                <div className="search">
                    <span className="text">Select an user to start chat</span>
                    <input type="text" autoFocus value={searchInput} onChange={(e) => setSearch(e.target.value)} ref={inputElement} className={active ? "active" : ""} placeholder="Enter name to search..." />
                    <button className={active ? "active" : ""} onClick={activeSearch} ><i className="fas fa-search"></i></button>
                </div>
                <div className="users-list">
                    {error && <div className="error-txt">{error}</div>}

                    {friends.map((f, i) =>{
                        if(friends.length === i+1){
                            return (<div key={f.user_id} ref={lastfriendRef} ><Friend friend={f} /></div>) 
                        }
                         return (<Friend key={f.user_id} friend={f} />);
                    })}

                    {isLoading && <div className="loading-wrap">
                        <CircularProgress  style={{color: "#c2c2c9", width: "30px", height: "30px"}}/>
                    </div>}
                </div>
            </section>
        </div> 
    );
}

export default memo(Home);