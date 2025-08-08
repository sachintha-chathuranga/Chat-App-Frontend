
const AuthReducer = (state, action) =>{
    switch(action.type){
        case "LOGIN_START":
           
            return({
                user: null,
                isFetching: true,
                error: null
            });

        case "UPDATE_START":
           
            return({
                user: state.user,
                isFetching: true,
                error: null
            });
      
        case "LOGIN_SUCCESS":
  
            return({
                user: action.payload,
                isFetching: false,
                error: null
            });
         
        case "LOGIN_FAILURE":
    
            return({
                user: null,
                isFetching: false,
                error: action.payload
            });

        case "UPDATE_FAILURE":

            return({
                user: state.user,
                isFetching: false,
                error: action.payload
            });

        case "LOG_OUT":
    
            return({
                user: null,
                isFetching: false,
                error: null
            });
            
        case "CLEAR_ERROR":
    
            return({
                user: state.user,
                isFetching: false,
                error: null
            });

        default:
            return (state);
    }
}

export default AuthReducer;