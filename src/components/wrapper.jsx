import React from 'react';

import "../styles/wrapper.css"
import {Link, Outlet, useLocation} from "react-router-dom";
import Header from "./header";

const Wrapper = () => {
    const location = useLocation();
    return (
        <div className="wrapper">
            <div className="wrapper_left">
                <div className="wrapper_left-head">
                    <h1 className="heading white">
                        CYBERION
                    </h1>
                </div>
                <div className="wrapper_left-body">
                    {
                        [
                            {
                                location: "/",
                                name: "Головна",
                            },
                            {
                                location: "/news",
                                name: "Новини",
                            },
                            {
                                location: "/blog",
                                name: "Блог",
                            },
                            {
                                location: "/users",
                                name: "Користувачі",
                            },
                            {
                                location: "/clubs",
                                name: "Клуби",
                            },
                            {
                                location: "/seasons",
                                name: "Турнірні сезони",
                            },
                            {
                                location: "/tournaments",
                                name: "Турніри",
                            },
                            {
                                location: "/separate-tournaments",
                                name: "Окремі турніри",
                            },
                            {
                                location: "/divisions",
                                name: "Дівізіони",
                            },
                            {
                                location: "/bans",
                                name: "Заблоковані користувачі",
                            },
                            {
                                location: "/settings",
                                name: "Налаштування профілю",
                            },
                        ].map((nav, index) => (
                            <Link key={index} to={nav.location} className={`wrapper_left-navigation ${location.pathname === nav.location || (location.pathname.includes(nav.location) && nav.location !== "/") ? 'wrapper_left-navigation_active' : ''} white`}>
                                {nav.name}
                            </Link>
                        ))
                    }
                </div>
            </div>
            <div className="wrapper_right">
                <Header/>
                <Outlet/>
            </div>
        </div>
    );
};

export default Wrapper;