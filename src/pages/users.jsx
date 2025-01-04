import React, {useEffect, useState} from 'react';
import "../styles/users.css";
import axios from "axios";
import Table from "../components/table";
import ErrorModal from "../components/errorModal";
import {debounce} from "lodash";

const Users = () => {
    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        try {
            const res = await axios.get("https://api.cyberion.com.ua/users/", {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            });

            const formattedUsers = res.data.map(item => ({
                "Ім'я": item.name || "",
                "Пошта": item.mail || "",
                "Тип акаунту": item.type || "",
                "id": item.id || 0,
            }));

            setUsers(formattedUsers);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchUsers()
    }, [])

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const setErrorState = (message) => {
        setError(message)
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 10000);
    }

    const debouncedFetchUsers = debounce(fetchUsers, 500);

    const handleDelete = async (id) => {
        await axios
            .delete(`https://api.cyberion.com.ua/users/id/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            })
            .then(res => debouncedFetchUsers())
            .catch(err => {
                setErrorState(err.message);
                console.log(err.message)
            })
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
            <div>
                <Table deletable={true} deleteCallback={handleDelete} editBaseLink={"/users/edit/"}
                       createBaseLink={'/users/create'} pageCount={10} body={users}
                       head={["Ім'я", "Пошта", "Тип акаунту"]}/>
            </div>
        </>
    );
};

export default Users;