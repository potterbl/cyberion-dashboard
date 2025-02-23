import React, {useEffect, useState} from 'react';
import "../styles/news.css";
import Table from "../components/table";
import api from "../api";
import {debounce} from "lodash";
import ErrorModal from "../components/errorModal";

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([])

    const fetchSeasons = async () => {
        try {
            const res = await api.get(`/tournaments/all/tournaments`);

            const formattedTournaments = res.data.map(item => ({
                "Назва": item.title || "",
                "Дата": new Date(item.date).toLocaleString() || "",
                "Гра": item.game || "",
                id: item.id,
            }));

            setTournaments(formattedTournaments);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchSeasons()
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

    const debouncedFetchTournaments = debounce(fetchSeasons, 500);

    const handleDelete = async (id) => {
        await api
            .delete(`tournaments/tournament/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                }
            })
            .then(res => debouncedFetchTournaments())
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
            <div className="common-wrapper">
                <Table deletable={true} deleteCallback={handleDelete} editable={true} editBaseLink={"/tournaments/edit/"} createBaseLink={'/tournaments/create'} pageCount={10} body={tournaments} head={["Назва", "Дата", "Гра"]}/>
            </div>
        </>
    );
};

export default Tournaments;