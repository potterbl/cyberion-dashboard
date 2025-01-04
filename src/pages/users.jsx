import React, {useEffect, useState} from 'react';
import "../styles/users.css";
import axios from "axios";
import Table from "../components/table";

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

    return (
        <div>
            <Table editBaseLink={"/users/edit/"} createBaseLink={'/users/create'} pageCount={10} body={users} head={["Ім'я", "Пошта", "Тип акаунту"]}/>
        </div>
    );
};

export default Users;