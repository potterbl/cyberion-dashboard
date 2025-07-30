import React, {useCallback, useState} from 'react';
import "../styles/blogEdit.css";
import EditHead from "../components/editHead";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";

import { ImageUpload } from "@fourcels/react-image-upload";
import "@fourcels/react-image-upload/dist/index.css";
import ErrorModal from "../components/errorModal";
import {debounce} from "lodash";

const BlogCreate = () => {
    const router = useNavigate();

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const [activePage, setActivePage] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState();
    const sections = [
        "Текст",
        "Медіа"
    ]

    const handleSave = async () => {
        const formdata = new FormData();
        formdata.append("image", image);
        formdata.append("title", title);
        formdata.append("content", content);
        formdata.append("description", description);
        await axios
            .post(`https://api.cyberion.com.ua/blog`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': localStorage.getItem('token')
                }
            })
            .then(() => {
                router('/blog')
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
            setContent(updatedHTML); // Обновляем состояние с новым HTML
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

        setContent(value);
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
            <div className="blog-edit">
                <EditHead sections={sections} setState={setActivePage} activePage={activePage}/>
                <div className="blog-edit_body">
                    {
                        activePage === 0 ? handleChange && (
                            <div className="blog-edit_body-text">
                                <div className="blog-edit_body-text_label">
                                    <p>Назва блогу</p>
                                    <input value={title} onChange={(e) => setTitle(e.target.value)}
                                           className="blog-edit_body-text_label-input"/>
                                </div>
                                <div className="blog-edit_body-text_label">
                                    <p>Опис блогу</p>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                           className="blog-edit_body-text_label-textarea" rows="3"/>
                                </div>
                                <div className="blog-edit_body-text_label">
                                    <p>Контент блогу</p>
                                    <ReactQuill
                                        onChange={handleChange}
                                        value={content}
                                        modules={modules}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="blog-edit_body-media">
                                <div className="blog-edit_body-text_label">
                                    <p>Зображення</p>
                                    <ImageUpload
                                        onChange={(e) => setImage(e[0]?.file)}
                                        // eslint-disable-next-line
                                        value={(typeof image === "string" ? `https://api.cyberion.com.ua/files/${image}` : typeof image === "File" ? URL.createObjectURL(image) : null)}
                                        max={1}
                                        itemClassName={"blog-edit_body-text_label-img"}
                                        dropzoneClassName={"blog-edit_body-text_label-img"}
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="blog-edit_footer">
                    <button className="blog-edit_footer-btn" onClick={handleSave}>
                        Зберегти
                    </button>
                </div>
            </div>
        </>
    );
};

export default BlogCreate;