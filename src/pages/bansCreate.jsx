import React, {useEffect, useState} from 'react';
import "../styles/usersCreate.css";
import EditHead from "../components/editHead";
import axios from "axios";
import Select from "react-select";
import {useNavigate} from "react-router-dom";
import ErrorModal from "../components/errorModal";
import api from "../api";

const BansCreate = () => {
    const navigate = useNavigate();

    const [activePage, setActivePage] = React.useState(0);
    const sections = [
        "Загальне"
    ]

    const [clubs, setClubs] = React.useState([]);

    useEffect(() => {
        const fetchClubs = async () => {
            await api.get("/clubs")
                .then(res => {
                    setClubs(res.data.map(c => ({
                            value: c.title,
                            label: c.title,
                        })
                    ))
                });
        }

        fetchClubs()
    }, []);


    const [name, setName] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [city, setCity] = React.useState("");

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const setErrorState = (message) => {
        setError(message)
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 10000);
    }

    const handleSave = async () => {
        await axios
            .post("https://api.cyberion.com.ua/bans", {
                name,
                nickname,
                city,
            }, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            })
            .then(res => {
                if (res.data.status === "conflict") {
                    setErrorState(res.data.message);
                    console.log(res.data.message)
                    return
                }
                navigate('/users')
            })
            .catch(err => {
                setErrorState(err.message);
                console.log(err.message)
            });
    }

    return (
        <>
            {
                error && showError && (
                    <ErrorModal errorMessage={`
                        <p style="font-size: 18px">${error}</p>
                    `}/>
                )
            }
            <div className="users-create">
                <EditHead sections={sections} setState={setActivePage} activePage={activePage}/>
                <div className="users-create_body">
                    <div className="users-create_body-label">
                        <p>Ім'я</p>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text"
                               className="users-create_body-label_input"/>
                    </div>
                    <div className="users-create_body-label">
                        <p>Нікнейм</p>
                        <input value={nickname} onChange={(e) => setNickname(e.target.value)} type="text"
                               className="users-create_body-label_input"/>
                    </div>
                    <div className="users-create_body-label">
                        <p>Місто</p>
                        <Select options={clubs} onChange={(v) => setCity(v.value)}
                                className="users-create_body-label_input-select"/>
                    </div>
                </div>
                <div className="users-create_footer">
                    <button className="users-create_footer-btn" onClick={handleSave}>
                        Створити користувача
                    </button>
                </div>
            </div>
        </>
    );
};

export default BansCreate;