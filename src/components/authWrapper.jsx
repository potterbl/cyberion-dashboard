import React from 'react';

import "../styles/authWrapper.css"
import {Outlet} from "react-router-dom";

const AuthWrapper = () => {
    return (
        <div className="auth">
            <Outlet/>
        </div>
    );
};

export default AuthWrapper;