import React, { useRef, useState, useEffect, useMemo } from "react";
import "../styles/table.css";
import {Link} from "react-router-dom";

const Table = ({ head, body, pageCount, editBaseLink, createBaseLink }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [columnWidths, setColumnWidths] = useState([]);
    const tableBodyRef = useRef(null);
    const [rowHeight, setRowHeight] = useState(0);

    const pagesCount = Math.ceil(body?.length / pageCount);

    const slicedBody = useMemo(() => {
        return body.slice((pageNumber - 1) * pageCount, pageNumber * pageCount);
    }, [body, pageNumber, pageCount]);

    // Инициализация ширины столбцов
    useEffect(() => {
        if (head?.length) {
            const initialWidth = 100 / head.length; // Равномерное распределение
            setColumnWidths(new Array(head.length).fill(initialWidth));
        }
    }, [head]);

    // Расчет высоты строк
    useEffect(() => {
        if (tableBodyRef?.current) {
            const height = tableBodyRef.current?.clientHeight;
            setRowHeight((height - (pageCount * 4)) / (pageCount || 10));
        }
    }, [pageCount, tableBodyRef]);

    const handleMouseDown = (index, event) => {
        const startX = event.clientX;
        const startWidth = columnWidths[index];

        const onMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            setColumnWidths((prevWidths) => {
                const newWidths = [...prevWidths];
                newWidths[index] = Math.max(10, startWidth + deltaX); // Минимальная ширина
                return newWidths;
            });
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

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
                        style={{ width: `${columnWidths[index]}%` }}
                    >
                        <p>{item}</p>
                        <span
                            className="table-head_resize"
                            onMouseDown={(e) => handleMouseDown(index, e)}
                        />
                    </div>
                ))}
            </div>
            <div className="table-body" ref={tableBodyRef}>
                {slicedBody?.map((row, rowIndex) => (
                    <Link to={editBaseLink + row.id} key={rowIndex} className="table-row" style={{ height: rowHeight }}>
                        {Object.keys(row)?.map((cell, cellIndex) => cell !== "id" && (
                            <div
                                key={cellIndex}
                                className="table-cell"
                                style={{ width: `${columnWidths[cellIndex]}%` }}
                                dangerouslySetInnerHTML={{ __html: row[cell] }}
                            >
                            </div>
                        ))}
                    </Link>
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
