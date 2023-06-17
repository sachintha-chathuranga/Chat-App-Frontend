// import { useEffect, useState } from 'react';
import { useContext } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";

function App() {
  const {user} = useContext(AuthContext);
  return (
      <Router>
        <Switch>
          <Route exact path="/">
              {user ? <Home /> : <Redirect to="/login" />}
          </Route>
          
          <Route path="/login">
              {user ? <Redirect to="/" /> : <Login />}
          </Route>

          <Route path="/signUp">
              {user ? <Redirect to="/" /> : <SignUp />}
          </Route>
      
          <Route path="/profile">
            {user ? <Profile /> : <Redirect to="/login" />}
          </Route>

          <Route path="/chat/:friend_id">
            {user ? <Chat /> :  <Redirect to="/login" />}
          </Route>

        </Switch>
      </Router>
  );
}

export default App;
