import React, {useEffect, useState} from 'react';
import "../styles/users.css";
import axios from "axios";
import Table from "../components/table";
import ErrorModal from "../components/errorModal";
import {debounce} from "lodash";

const Bans = () => {
    const [bans, setBans] = useState([])

    const fetchBans = async () => {
        try {
            const res = await axios.get("https://api.cyberion.com.ua/bans/", {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            });

            const formattedUsers = res.data.map(item => ({
                "Ім'я": item.name || "",
                "Нікнейм": item.nickname || "",
                "Місто": item.city || "",
                "id": item.id || 0,
            }));

            setBans(formattedUsers);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchBans()
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

    const debouncedFetchBans = debounce(fetchBans, 500);

    const handleDelete = async (id) => {
        await axios
            .delete(`https://api.cyberion.com.ua/users/id/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            })
            .then(res => debouncedFetchBans())
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
                <Table deletable={true} deleteCallback={handleDelete}
                       createBaseLink={'/bans/create'} pageCount={10} body={bans}
                       head={["Ім'я", "Нікнейм", "Місто"]}/>
            </div>
        </>
    );
};

export default Bans;