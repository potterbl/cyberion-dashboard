import React, {useEffect, useState} from 'react';
import "../styles/usersCreate.css";
import EditHead from "../components/editHead";
import {useNavigate, useParams} from "react-router-dom";
import ErrorModal from "../components/errorModal";
import api from "../api";
import {ImageUpload} from "@fourcels/react-image-upload";

const SeasonsEdit = () => {
    const navigate = useNavigate();
    const params = useParams();

    const {id} = params

    const [activePage, setActivePage] = React.useState(0);
    const sections = [
        "Загальне",
        "Медіа",
    ]

    const [title, setTitle] = React.useState("");
    const [image, setImage] = React.useState();

    const fetchTournament = async () => {
        await api
            .get(`tournaments/season/${id}`)
            .then((res) => {
                setTitle(res.data.title);
                setImage(res.data.image)
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        if(title) return
        fetchTournament();
        // eslint-disable-next-line
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

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
        await api
            .put(`/tournaments/season/${id}`, formData, {
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
                navigate('/seasons')
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
                    {
                        activePage === 0 ?
                            (
                                <div className="users-create_body-label">
                                    <p>Назва сезону</p>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text"
                                           className="users-create_body-label_input"/>
                                </div>
                            )
                            : activePage === 1 &&
                                (
                                    <div className="news-edit_body-text_label">
                                        <p>Зображення</p>
                                        <ImageUpload
                                            onChange={(e) => setImage(e[0]?.file)}
                                            // eslint-disable-next-line
                                            value={(typeof image === "string" ? `https://api.cyberion.com.ua/files/${image}` : typeof image === "File" ? URL.createObjectURL(image) : null)}
                                            max={1}
                                            itemClassName={"news-edit_body-text_label-img"}
                                            dropzoneClassName={"news-edit_body-text_label-img"}
                                        />
                                    </div>
                                )
                    }
                </div>
                <div className="users-create_footer">
                    <button className="users-create_footer-btn" onClick={handleSave}>
                        Створити сезон
                    </button>
                </div>
            </div>
        </>
    );
};

export default SeasonsEdit;