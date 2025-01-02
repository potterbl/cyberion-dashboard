import React from 'react';
import "../styles/errorModal.css";

const ErrorModal = ({errorMessage}) => {
    return (
        <div className="error-modal" dangerouslySetInnerHTML={{ __html: errorMessage }}>
        </div>
    );
};

export default ErrorModal;