import React from 'react';
import "../styles/editHead.css";

const EditHead = ({sections, setState, activePage}) => {
    return (
        <div className="edit-head">
            <button className="edit-head_btn"/>
            <div className="edit-head_body">
                {
                    sections?.map((section, index) => (
                        <div className={`edit-head_item ${activePage === index ? 'edit-head_item-active' : ''}`} onClick={() => setState(index)}>{section}</div>
                    ))
                }
            </div>
            <button className="edit-head_btn"/>
        </div>
    );
};

export default EditHead;