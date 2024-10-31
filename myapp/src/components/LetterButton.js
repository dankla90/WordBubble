import React from 'react';

function LetterButton({ letter, onClick }) {
    return (
        <button className="letter-button" onClick={onClick}>
            {letter}
        </button>
    );
}

export default LetterButton;
