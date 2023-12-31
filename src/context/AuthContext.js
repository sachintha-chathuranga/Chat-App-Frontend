import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";


export const INITIAL_STATE = {
    // user: {
    //     user_id: 1,
    //     fname: "Sachintha",
    //     lname: "Chathuranga",
    //     email: "sachintha@gmail.com",
    //     profil_pic: null,
    //     status: true
    // },
    user: JSON.parse(sessionStorage.getItem("user")),
    isFetching: false,
    error: null
}

export const AuthContext = createContext(INITIAL_STATE);

export const  AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    return (
        <AuthContext.Provider 
            value={{
                user: state.user,
                isFetching: state.isFetching, 
                error: state.error,
                dispatch
            }}>
            {children}
        </AuthContext.Provider>
    );
}