import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../store/slices/user.slice";
import axios from "axios";

const RequireAuth = ({children}) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user)

    if(!token || !user){
        navigate("/auth/login")
    }

    const fetchData = async () => {
        await axios
            .get(`https://api.cyberion.com.ua/users/${token}`)
            .then(res => {
                dispatch(setUser(res.data));
            })
            .catch(_ => {
                navigate("/auth/login")
            });
    }

    if (user.type === "") {
        fetchData()
    }

    return children
};

export default RequireAuth;