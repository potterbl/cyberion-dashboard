import React, {useState} from 'react';

import "../styles/header.css"
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setUser} from "../store/slices/user.slice";

const Header = () => {
    const {name} = useSelector(state => state.user);
    const [isActive, setIsActive] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className="header">
            <div className="header_user" onClick={(e) => {
                e.stopPropagation();
                setIsActive(!isActive)
            }}>
                {name}
                <span className={`header_span ${isActive ? "header_span_active" : ""}`}/>
                <dev className={`header_user-menu ${isActive ? "header_user-menu_active" : ""}`}>
                    <button className="header_user-menu_btn" onClick={() => {
                        localStorage.removeItem("token")
                        dispatch(setUser({name: "", type: ""}))
                        navigate("/login")
                    }}>
                        Вийти
                    </button>
                </dev>
            </div>
        </div>
    );
};

export default Header;