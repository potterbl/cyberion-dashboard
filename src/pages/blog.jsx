import React, {useEffect, useState} from 'react';
import "../styles/blog.css";
import Table from "../components/table";
import axios from "axios";

const Blog = () => {
    const [blog, setBlog] = useState([])

    const fetchBlog = async () => {
        try {
            const res = await axios.get("https://api.cyberion.com.ua/blog");

            const formattedBlog = res.data.map(item => ({
                "Назва": item.title || "",
                "Опис": item.description || "",
                "Контент": item.content ? item.content.substring(0, 100) + "..." : "",
                "Дата": new Date(item.createdAt).toLocaleString() || "",
                "id": item.id || 0,
            }));

            console.log(formattedBlog)

            setBlog(formattedBlog);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchBlog()
    }, [])

    return (
        <div className="blog">
            <Table editable={true} editBaseLink={"/blog/edit/"} createBaseLink={'/blog/create'} pageCount={10} body={blog} head={["Назва", "Опис", "Контент", "Дата"]}/>
        </div>
    );
};

export default Blog;