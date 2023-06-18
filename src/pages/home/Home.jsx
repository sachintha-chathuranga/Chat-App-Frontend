import axios from 'axios';
import { MoreVert } from "@material-ui/icons";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from '../../context/AuthContext';
import Friend from '../../component/Friend';
import { logOutCall } from '../../apiCalls';
import './home.css';

const API_URL = process.env.REACT_APP_API_URL;
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const imageUrl = process.env.REACT_APP_AWS_URL;

export default function Home() {

    const {user, dispatch} = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [active, setActive] = useState(false);
    const [searchInput, setSearch] = useState("");
    const inputElement = useRef();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const searchFriend = async () => {
            axios.post(`${API_URL}search/${user.user_id}`, {name: searchInput}).then(res =>{
                setFriends(res.data);
            }).catch(err => console.log(err));
        }
        searchFriend();
    }, [searchInput, user.user_id]);

    useEffect(() => {
        const fetchFriend = async () => {
            axios.get(`${API_URL}friends/` + user.user_id).then(res =>{
                setFriends(res.data);
            }).catch(err => console.log(err));
        }
        fetchFriend();
    }, [user.user_id]);

    const activeSearch = () =>{
        setActive(!active);
        setSearch("");
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
                            <div onClick={() => logOutCall({user_id: user.user_id, status: false}, dispatch)} className="logout">Logout</div>
                        </div>
                    </div>
                </header>
                <div className="search">
                    <span className="text">Select an user to start chat</span>
                    <input type="text" autoFocus value={searchInput} onChange={(e) => setSearch(e.target.value)} ref={inputElement} className={active ? "active" : ""} placeholder="Enter name to search..." />
                    <button className={active ? "active" : ""} onClick={activeSearch} ><i className="fas fa-search"></i></button>
                </div>
                <div className="users-list">
                    {friends.map((f) =>(
                         <Link key={f.user_id} to={"/chat/"+f.user_id} style={{textDecoration:"none"}} >
                             <Friend key={f.user_id} friend={f} />
                         </Link>
                    ))}
                </div>
            </section>
        </div> 
    );
}
