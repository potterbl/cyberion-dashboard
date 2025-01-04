import React, {useState} from 'react';
import "../styles/usersCreate.css";
import EditHead from "../components/editHead";
import axios from "axios";
import Select from "react-select";
import {useNavigate} from "react-router-dom";
import ErrorModal from "../components/errorModal";

const UsersCreate = () => {
    const navigate = useNavigate();

    const [activePage, setActivePage] = React.useState(0);
    const sections = [
        "Загальне"
    ]

    const [name, setName] = React.useState("");
    const [mail, setMail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [role, setRole] = React.useState("");

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
            .post("https://api.cyberion.com.ua/users", {
                name,
                mail,
                password,
                type: role.value,
            }, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            })
            .then(res => {
                if(res.data.status === "conflict"){
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

    const roles = [
        { value: 'admin', label: 'Г. Адміністратор'},
        { value: 'club admin', label: 'Адміністратор клубу(-ів)'},
    ]

    return (
        <>
            {
                error && showError && (
                    <ErrorModal errorMessage={`
                        <p style="font-size: 18px">${error}</p>
                    `} />
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
                        <p>Пошта</p>
                        <input value={mail} onChange={(e) => setMail(e.target.value)} type="text"
                               className="users-create_body-label_input"/>
                    </div>
                    <div className="users-create_body-label">
                        <p>Пароль</p>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="text"
                               className="users-create_body-label_input"/>
                    </div>
                    <div className="users-create_body-label">
                        <p>Права</p>
                        <Select options={roles} onChange={(v) => setRole(v)} className="users-create_body-label_input-select"/>
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

export default UsersCreate;