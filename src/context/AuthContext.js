import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";


export const INITIAL_STATE = {
    // user: {
    //     user_id: 1,
    //     fname: "Sachintha",
    //     lname: "Chathuranga",
    //     email: "sachintha@gmail.com",
    //     profil_pic: "default.png",
    //     status: true
    // },
    user: null,
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