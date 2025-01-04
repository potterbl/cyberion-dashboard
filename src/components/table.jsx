import React, { useState, useMemo } from "react";
import "../styles/table.css";
import {Link} from "react-router-dom";

import trashIcon from "../images/trash.svg"

const Table = ({ head, body, pageCount, editBaseLink, createBaseLink, editable, deletable, deleteCallback }) => {
    const [pageNumber, setPageNumber] = useState(1);

    const pagesCount = Math.ceil(body?.length / pageCount);

    const slicedBody = useMemo(() => {
        return body.slice((pageNumber - 1) * pageCount, pageNumber * pageCount);
    }, [body, pageNumber, pageCount]);

    return (
        <div className="table">
            <div className="table-add">
                <Link to={createBaseLink} className="table-add_btn">
                    Додати
                </Link>
            </div>
            <div className="table-head">
                {head?.map((item, index) => (
                    <div
                        key={index}
                        className="table-head_item"
                    >
                        <p>{item}</p>
                    </div>
                ))}
                {
                    deletable && (
                        <div
                            className="table-head_item"
                        >
                            <p>Видалити</p>
                        </div>
                    )
                }
            </div>
            <div className="table-body">
                {slicedBody?.map((row, rowIndex) => editable ? (
                    <Link to={editBaseLink + row.id} key={rowIndex} className={`table-row ${rowIndex % 2 === 0 ? 'table-row_dark' : ''}`}>
                        {Object.keys(row)?.map((cell, cellIndex) => cell !== "id" && (
                            <div
                                key={cellIndex}
                                className="table-cell"
                                dangerouslySetInnerHTML={{ __html: row[cell] }}
                            >
                            </div>
                        ))}
                        {
                            deletable && (
                                <div
                                    className="table-cell"
                                >
                                    <img src={trashIcon} alt="trash" onClick={() => deleteCallback(row.id)} className="table-cell_delete"/>
                                </div>
                            )
                        }
                    </Link>
                ) : (
                    <div key={rowIndex} className={`table-row ${rowIndex % 2 === 0 ? 'table-row_dark' : ''}`}>
                        {Object.keys(row)?.map((cell, cellIndex) => cell !== "id" && (
                            <div
                                key={cellIndex}
                                className="table-cell"
                                dangerouslySetInnerHTML={{ __html: row[cell] }}
                            >
                            </div>
                        ))}
                        {
                            deletable && (
                                <div
                                    className="table-cell"
                                >
                                    <img src={trashIcon} alt="trash" onClick={() => deleteCallback(row.id)} className="table-cell_delete"/>
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
            <div className="table-footer">
                {pagesCount !== -1 &&
                    new Array(pagesCount || 10).fill(0).map((_, index) => (
                        <button
                            key={index}
                            className={`table-footer_btn ${
                                index === pageNumber - 1 ? "table-footer_btn-active" : ""
                            }`}
                            onClick={() => setPageNumber(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default Table;
