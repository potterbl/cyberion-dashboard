import React, {useEffect, useState} from 'react';
import "../styles/news.css";
import Table from "../components/table";
import axios from "axios";

const News = () => {
    const [news, setNews] = useState([])

    const fetchNews = async () => {
        try {
            const res = await axios.get("https://api.cyberion.com.ua/news");

            const formattedNews = res.data.map(item => ({
                "Назва": item.title || "",
                "Текст": item.text || "",
                "Посилання на відео ютуб": item.youtubeLink || "",
                "Дата": new Date(item.date).toLocaleString() || "",
                "id": item.id || 0,
            }));

            setNews(formattedNews);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchNews()
    }, [])

    return (
        <div className="news">
            <Table editBaseLink={"/news/edit/"} pageCount={10} body={news} head={["Назва", "Текст", "Посилання на відео ютуб", "Дата"]}/>
        </div>
    );
};

export default News;