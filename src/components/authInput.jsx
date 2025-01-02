import React from 'react';
import "../styles/authInput.css"

const AuthInput = ({label, type, setState, state}) => {
    return (
        <label className="auth-input_label">
            <p>{label}</p>
            <input value={state} onChange={setState} className="auth-input" placeholder={label} type={type}/>
        </label>
    );
};

export default AuthInput;