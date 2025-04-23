import React, {useEffect, useRef, useState} from 'react';
import "../styles/usersCreate.css";
import EditHead from "../components/editHead";
import {useNavigate, useParams} from "react-router-dom";
import ErrorModal from "../components/errorModal";
import api from "../api";
import {ImageUpload} from "@fourcels/react-image-upload";
import DatePicker from "react-datepicker";

const SeparateTournamentsEdit = () => {
    const navigate = useNavigate();
    const params = useParams();

    const {id} = params

    const [activePage, setActivePage] = React.useState(0);
    const sections = [
        "Загальне",
        "Медіа",
        "Регламент",
        "Участь",
    ]

    const [title, setTitle] = React.useState("");
    const [image, setImage] = React.useState();
    const [date, setDate] = React.useState(new Date());
    const [game, setGame] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [prizePull, setPrizePull] = React.useState([""]);
    const [teamSize, setTeamSize] = React.useState("");
    const [entry, setEntry] = React.useState("");
    const [format, setFormat] = React.useState("");
    const [prizesFrom, setPrizesFrom] = React.useState("");
    const [customReglament, setCustomReglament] = React.useState([{ title: "", values: [""] }]);

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const setErrorState = (message) => {
        setError(message)
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 10000);
    }

    const fetchTournament = async () => {
        await api.get(`/tournaments/separate-tournament/${id}`)
            .then(res => {
                setTitle(res.data.title)
                setImage(res.data.image)
                setDate(res.data.date)
                setGame(res.data.game)
                setUrl(res.data.url)
                setPrizePull(res.data.prizePull)
                setTeamSize(res.data.teamSize)
                setEntry(res.data.entry)
                setFormat(res.data.format)
                setPrizesFrom(res.data.prizesFrom)
                setCustomReglament(res.data.customReglament)
            })
    }

    useEffect(() => {
        if (title !== "") return
        fetchTournament()
    }, [title]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
        formData.append("date", date);
        formData.append("game", game);
        formData.append("url", url);
        prizePull.forEach((prize, index) => {
            formData.append(`prizePull[${index}]`, prize);
        });
        formData.append("teamSize", teamSize);
        formData.append("entry", entry);
        formData.append("format", format);
        formData.append("prizesFrom", prizesFrom);
        formData.append("customReglament", JSON.stringify(customReglament));
        await api
            .put(`/tournaments/separate-tournament/${id}`, formData, {
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
                navigate('/separate-tournaments')
            })
            .catch(err => {
                setErrorState(err.message);
                console.log(err.message)
            });
    }

    const handleAddPrizePull = () => {
        setPrizePull(prev => ([...prev, ""]));
    };
    const handleRemovePrizePull = (index) => {
        setPrizePull(prev => prev.filter((_, i) => i !== index));
    };

    const inputRefs = useRef({});


    const handleInputRemove = (index) => {
        setCustomReglament((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddItem = () => {
        setCustomReglament((prev) => [
            ...prev,
            { title: "", values: [""] }
        ]);
    };

    const handleAddSubItem = (index) => {
        setCustomReglament((prev) => {
            return prev.map((section, idx) => {
                if (idx === index) {
                    return {
                        ...section, // Spread the existing section to avoid mutation
                        values: [...section.values, ""] // Add a new empty value
                    };
                }
                return section; // Return unchanged sections
            });
        });
    };

    const handleInputChange = (index, subIndex, value) => {
        setCustomReglament((prev) => {
            const updated = [...prev];
            updated[index].values[subIndex] = value;
            return updated;
        });
    };

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
                                <>
                                    <div className="users-create_body-label">
                                        <p>Назва турніру</p>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text"
                                               className="users-create_body-label_input"/>
                                    </div>
                                    <div className="users-create_body-label">

                                        <div className="news-edit_body-text_label">
                                            <p>Дата та час</p>
                                            <DatePicker showTimeSelect={true} selected={date}
                                                        onChange={(date) => setDate(date)}
                                                        wrapperClassName={"react-datepicker-wrapper_custom"}/>
                                        </div>
                                    </div>
                                    <div className="users-create_body-label">
                                        <p>Посилання</p>
                                        <input value={url} onChange={(e) => setUrl(e.target.value)} type="text"
                                               className="users-create_body-label_input"/>
                                    </div>
                                </>
                            )
                            : activePage === 1 ?
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
                                : activePage === 2 ?
                                    (
                                        <>
                                            {customReglament.map((section, index) => (
                                                <div className="users-create_body-label" key={index}>
                                                    <div className="common-input_with-btn_wrapper">
                                                        <div className="users-create_body-label">
                                                            <p>Назва пункту {index + 1}</p>
                                                            <input
                                                                value={section.title}
                                                                onChange={(e) => {
                                                                    const updated = [...customReglament];
                                                                    updated[index].title = e.target.value;
                                                                    setCustomReglament(updated);
                                                                }}
                                                                type="text"
                                                                className="users-create_body-label_input"
                                                            />
                                                        </div>
                                                        <button
                                                            className="common-button-for-input-content"
                                                            onClick={() => handleInputRemove(index)}
                                                        >
                                                            Видалити пункт
                                                        </button>
                                                    </div>

                                                    {section.values.map((value, subIndex) => (
                                                        <div className="common-input_with-btn_wrapper" key={subIndex} style={{ paddingLeft: 48 }}>
                                                            <div className="users-create_body-label">
                                                                <p>Підпункт {subIndex + 1}</p>
                                                                <input
                                                                    ref={(el) => (inputRefs.current[`${index}-${subIndex}`] = el)}
                                                                    value={value}
                                                                    onChange={(e) => handleInputChange(index, subIndex, e.target.value)}
                                                                    type="text"
                                                                    className="users-create_body-label_input"
                                                                />
                                                            </div>
                                                            <button
                                                                className="common-button-for-input-content"
                                                                onClick={() => {
                                                                    const updated = [...customReglament];
                                                                    updated[index].values = updated[index].values.filter((_, i) => i !== subIndex);
                                                                    setCustomReglament(updated);
                                                                }}
                                                            >
                                                                Видалити
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button className="common-button-content" onClick={() => handleAddSubItem(index)}>
                                                        Додати підпункт
                                                    </button>
                                                    <hr/>
                                                </div>
                                            ))}
                                            <button className="common-button-content" onClick={handleAddItem}>
                                                Додати пункт
                                            </button>
                                        </>
                                    ) : activePage === 3 && (
                                    <>
                                        <div className="users-create_body-label">
                                            <p>Гра</p>
                                            <input value={game} onChange={(e) => setGame(e.target.value)} type="text"
                                                   className="users-create_body-label_input"/>
                                        </div>
                                        <hr/>
                                        <div className="users-create_body-label">
                                            <p>Призовий пул</p>
                                            {
                                                prizePull.map((item, index) => (
                                                    <>
                                                        <p>{index + 1} місце</p>
                                                        <div className="common-input_with-btn_wrapper">
                                                            <input value={item}
                                                                   onChange={(e) => setPrizePull(prev => prev.map((p, pIndex) => (pIndex === index ? e.target.value : p)))}
                                                                   type="text"
                                                                   className="users-create_body-label_input"/>
                                                            <button className="common-button-for-input-content"
                                                                    onClick={() => handleRemovePrizePull(index)}>Видалити
                                                            </button>
                                                        </div>
                                                    </>

                                                ))
                                            }
                                            <button className="common-button-content"
                                                    onClick={handleAddPrizePull}>
                                                Додати призове місце
                                            </button>
                                        </div>
                                        <hr/>
                                        <div className="users-create_body-label">
                                            <p>Розмір команди</p>
                                            <input value={teamSize} onChange={(e) => setTeamSize(e.target.value)}
                                                   type="text"
                                                   className="users-create_body-label_input"/>
                                        </div>
                                        <div className="users-create_body-label">
                                            <p>Вступний внесоок</p>
                                            <input value={entry} onChange={(e) => setEntry(e.target.value)} type="text"
                                                   className="users-create_body-label_input"/>
                                        </div>
                                        <div className="users-create_body-label">
                                            <p>Формат</p>
                                            <input value={format} onChange={(e) => setFormat(e.target.value)} type="text"
                                                   className="users-create_body-label_input"/>
                                        </div>
                                        <div className="users-create_body-label">
                                            <p>Від якого бренду призи</p>
                                            <input value={prizesFrom} onChange={(e) => setPrizesFrom(e.target.value)}
                                                   type="text"
                                                   className="users-create_body-label_input"/>
                                        </div>
                                    </>
                                )
                    }
                </div>
                <div className="users-create_footer">
                    <button className="users-create_footer-btn" onClick={handleSave}>
                        Зберегти турнір
                    </button>
                </div>
            </div>
        </>
    );
};

export default SeparateTournamentsEdit;