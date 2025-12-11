import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Shared/Loading/Loading';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return <Loading></Loading>
    }

    if (!user){
        <Navigate to="/login" state={{from: location}} replace></Navigate>;
    }

    return children;
};

export default PrivateRoute;