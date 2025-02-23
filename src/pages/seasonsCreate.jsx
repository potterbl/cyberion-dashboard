import React, {useRef, useState} from 'react';
import "../styles/usersCreate.css";
import EditHead from "../components/editHead";
import {useNavigate} from "react-router-dom";
import ErrorModal from "../components/errorModal";
import api from "../api";
import {ImageUpload} from "@fourcels/react-image-upload";

const SeasonsCreate = () => {
    const inputRefs = useRef({});
    const navigate = useNavigate();

    const [activePage, setActivePage] = React.useState(0);
    const sections = [
        "Загальне",
        "Медіа",
        "Регламент",
    ]

    const [title, setTitle] = React.useState("");
    const [image, setImage] = React.useState();
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

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);
        formData.append("customReglament", JSON.stringify(customReglament));
        await api
            .post("/tournaments/season", formData, {
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
                                <div className="users-create_body-label">
                                    <p>Назва сезону</p>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text"
                                           className="users-create_body-label_input"/>
                                </div>
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
                                : activePage === 2 &&
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

export default SeasonsCreate;