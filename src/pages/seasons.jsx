import React, {useEffect, useState} from 'react';
import "../styles/news.css";
import Table from "../components/table";
import api from "../api";
import {debounce} from "lodash";
import ErrorModal from "../components/errorModal";

const Seasons = () => {
    const [seasons, setSeasons] = useState([])

    const fetchSeasons = async () => {
        try {
            const res = await api.get(`/tournaments/all/seasons`);

            const formattedSeasons = res.data.map(item => ({
                "Назва": item.title || "",
                id: item.id,
            }));

            setSeasons(formattedSeasons);
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
            .delete(`tournaments/season/${id}`, {
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
                <Table deletable={true} deleteCallback={handleDelete} editable={true} editBaseLink={"/seasons/edit/"} createBaseLink={'/seasons/create'} pageCount={10} body={seasons} head={["Назва"]}/>
            </div>
        </>
    );
};

export default Seasons;