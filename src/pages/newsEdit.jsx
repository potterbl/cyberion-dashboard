import React, {useEffect, useState} from 'react';
import "../styles/newsEdit.css";
import EditHead from "../components/editHead";
import {useParams} from "react-router-dom";
import axios from "axios";
import { Editor } from "react-draft-wysiwyg"
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";

const NewsEdit = () => {
    const params = useParams();
    const {id} = params
    const [newItem, setNewItem] = useState();
    const [activePage, setActivePage] = useState(0);
    const [text, setText] = useState("");
    const sections = [
        "Текст",
        "Медіа"
    ]

    const fetchNew = async () => {
        await axios
            .get(`https://api.cyberion.com.ua/news/${id}`)
            .then((res) => {
                setNewItem(res.data)
                setText(res.data.text)
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        if(newItem) return
        fetchNew();
        // eslint-disable-next-line
    }, [newItem])
    return (
        <div className="news-edit">
            <EditHead sections={sections} setState={setActivePage} activePage={activePage}/>
            <div className="news-edit_body">
                {
                    activePage === 0 ? (
                        <div className="news-edit_body-text">
                            <div className="news-edit_body-text_label">
                                <p>Текст новини</p>
                                <ReactQuill value={text} onChange={setText} />
                            </div>
                        </div>
                    ) : (
                        <div className="news-edit_body-media">

                        </div>
                    )
                }
            </div>
            <div className="news-edit_footer">
                <button className="news-edit_footer-btn">
                    Зберегти
                </button>
            </div>
        </div>
    );
};

export default NewsEdit;