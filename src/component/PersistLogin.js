import { CircularProgress } from '@material-ui/core';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const PersistLogin = () => {
    const [isLoading, setisLoading] = useState(true);
    const {user, isFetching, dispatch} = useContext(AuthContext);
    
    useEffect(() => {
        const verifyRefreshToken = async () => {
            try{
                await getNewToken(dispatch);
            }
            catch(err){
                console.error(err)
            }
            finally{
                setisLoading(false);
            }
        }
        !user?.access_token ? verifyRefreshToken() : setisLoading(false);
    }, []);

    return (
        <>
            {isLoading ? <CircularProgress style={{color: "white", width: "30px", height: "30px"}} /> : <Outlet /> }
        </>
    );
}

export default PersistLogin;
