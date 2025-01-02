import React from 'react';
import "../styles/authButton.css";

const AuthButton = ({text, onClick}) => {
    return (
        <button className="auth-button" onClick={onClick}>
            {text}
        </button>
    );
};

export default AuthButton;