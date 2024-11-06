// PossibleWordsList.js
import React from 'react';

const PossibleWordsList = ({ possibleWords, hasGivenUp, isDisabled, hasPlayedToday }) => {
    return (
        <div className="possible-words-list">
            <h3>Word List</h3>
            {/* Display possible words regardless of game status */}
            {hasGivenUp || isDisabled || hasPlayedToday ? (
                <div>
                    <h4>All possible words:</h4>
                    {possibleWords.map((word, index) => (
                        <div key={index}>{word}</div>
                    ))}
                </div>
            ) : (
                <p>Keep guessing!</p>
            )}
        </div>
    );
};

export default PossibleWordsList;
