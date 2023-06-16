export const LoginStart = (userCredintial) => ({
    type: "LOGIN_START"
});
export const UpdateStart = () => ({
    type: "UPDATE_START"
});

export const LoginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user
});

export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error
});
export const UpdateFailure = (error) => ({
    type: "UPDATE_FAILURE",
    payload: error
});

export const LogOut = () => ({
    type: "LOG_OUT"
});

export const ClearError = () => ({
    type: "CLEAR_ERROR"
});
