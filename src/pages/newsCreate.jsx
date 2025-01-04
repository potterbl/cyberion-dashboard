import React, {useCallback, useState} from 'react';
import "../styles/newsEdit.css";
import EditHead from "../components/editHead";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

import { ImageUpload } from "@fourcels/react-image-upload";
import "@fourcels/react-image-upload/dist/index.css";
import ErrorModal from "../components/errorModal";
import {debounce} from "lodash";

const NewsEdit = () => {
    const router = useNavigate();

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const [activePage, setActivePage] = useState(0);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [date, setDate] = useState(new Date());
    const [youtubeLink, setYoutubeLink] = useState("");
    const [image, setImage] = useState();
    const sections = [
        "Текст",
        "Медіа"
    ]

    function getYouTubeVideoId(url) {
        // eslint-disable-next-line
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : ""; // Возвращаем пустую строку, если ID не найден
    }

    const handleSave = async () => {
        const formdata = new FormData();
        console.log(image)
        formdata.append("image", image);
        formdata.append("youtubeLink", youtubeLink);
        formdata.append("date", date.toISOString());
        formdata.append("title", title);
        formdata.append("text", text);
        formdata.append("isYoutube", youtubeLink !== "");
        await axios
            .post(`https://api.cyberion.com.ua/news`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': localStorage.getItem('token')
                }
            })
            .then(res => {
                router('/news')
            })
            .catch(err => {
                setErrorState(err.message);
                console.log(err.message)
            })
    }

    const setErrorState = (message) => {
        setError(message)
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 10000);
    }

    // eslint-disable-next-line
    const debouncedSave = useCallback(
        debounce((updatedHTML) => {
            setText(updatedHTML); // Обновляем состояние с новым HTML
        }), // Задержка 500 миллисекунд
        []
    );

    const handleChange = (value) => {
        const editor = document.querySelector(".ql-editor");
        if (editor) {
            const elements = editor.querySelectorAll("h2, h3, p");
            elements.forEach((el) => {
                if (el.tagName === "H2" && !el.className.includes("heading-smaller")) {
                    // Преобразуем <h2> в <p class="heading-smaller">
                    el.className = "heading-smaller thin";
                } else if (el.tagName === "H3" && !el.className.includes("body-text-bigger")) {
                    // Преобразуем <h3> в <p class="body-text-bigger">
                    el.className = "body-text-bigger thin";
                } else if (el.tagName === "P" && !el.className.includes("body-text")) {
                    // Сбрасываем всё к "body-text", если переключились на Normal
                    el.className = "body-text";
                }
            });

            const updatedHTML = editor.innerHTML;

            // Вызовем дебаунсинг для сохранения текста
            debouncedSave(updatedHTML);
        }

        setText(value);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: ["#ffffff", "#000000", "#ffde00", "red", "blue", "purple", "orange"] }], // Добавление цветового форматирования
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"], // Очистка форматирования
        ],
    };

    return (
        <>
            {
                error && showError && (
                    <ErrorModal errorMessage={`
                        <p style="font-size: 18px">${error}</p>
                    `} />
                )
            }
            <div className="news-edit">
                <EditHead sections={sections} setState={setActivePage} activePage={activePage}/>
                <div className="news-edit_body">
                    {
                        activePage === 0 ? handleChange && (
                            <div className="news-edit_body-text">
                                <div className="news-edit_body-text_label">
                                    <p>Дата публікації</p>
                                    <DatePicker selected={date} onChange={(date) => setDate(date)} wrapperClassName={"react-datepicker-wrapper_custom"}/>
                                </div>
                                <div className="news-edit_body-text_label">
                                    <p>Назва новини</p>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                                           className="news-edit_body-text_label-input"/>
                                </div>
                                <div className="news-edit_body-text_label">
                                    <p>Текст новини</p>
                                    <ReactQuill
                                        onChange={handleChange}
                                        value={text}
                                        modules={modules}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="news-edit_body-media">
                                <div className="news-edit_body-text_label">
                                    <p>Посилання на відео ютуб</p>
                                    <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)}
                                           type="url" className="news-edit_body-media_input"/>
                                    <LiteYouTubeEmbed
                                        id={getYouTubeVideoId(youtubeLink)}
                                        title={""}
                                        wrapperClass={"news-edit_body-text_label_yt"}
                                        iframeClass="news-edit_body-text_label_yt"
                                    />
                                </div>
                                {
                                    youtubeLink === "" && (
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
                        )
                    }
                </div>
                <div className="news-edit_footer">
                    <button className="news-edit_footer-btn" onClick={handleSave}>
                        Зберегти
                    </button>
                </div>
            </div>
        </>
    );
};

export default NewsEdit;