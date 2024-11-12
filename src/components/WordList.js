import React from 'react';

function WordList({ currentWord }) {
    return (
        <div className="word-list">
            <p>Current Word: {currentWord}</p>
        </div>
    );
}

export default WordList;
