import React from 'react';
import classes from './ErrorModal.module.css';

function ErrorModal({ errorMessage, onClose }) {
  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContent}>
        <h2>Error</h2>
        <p>{JSON.stringify(errorMessage)}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ErrorModal;
