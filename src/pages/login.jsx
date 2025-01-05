import React, {useState} from 'react';
import "../styles/login.css"
import AuthInput from "../components/authInput";
import AuthButton from "../components/authButton";
import axios from "axios";
import {useDispatch} from "react-redux";
import {setUser} from "../store/slices/user.slice";
import ErrorModal from "../components/errorModal";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");

    const login = async () => {
        await axios.post("https://api.cyberion.com.ua/users/login",
            {mail: email, password}
        )
            .then(res => {
                if(res.data.status === 401){
                    return setErrorState("Неправильний логін або пароль")
                }
                localStorage.setItem("token", res.data.token)
                dispatch(setUser(res.data))
                return navigate("/")
            })
            .catch(err => console.log(err));
    }
    const setErrorState = (message) => {
        setError(message)
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 10000);
    }
    return (
        <>
            {
                error && showError && (
                    <ErrorModal errorMessage={`
                        <p style="font-size: 18px">${error}</p>
                    `} />
                )
            }
            <div className="login">
                <AuthInput label={"Логін"} type={"email"} state={email} setState={(e) => setEmail(e.target.value)}/>
                <AuthInput label={"Пароль"} type={"password"} state={password} setState={(e) => setPassword(e.target.value)}/>
                <AuthButton text={"Увійти"} onClick={login}/>
            </div>
        </>
    );
};

export default Login;