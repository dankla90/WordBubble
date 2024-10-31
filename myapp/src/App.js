import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import StatsModal from './components/StatsModal';
import getDailyLetters from './data/dailyWords';
import './index.css';

function App() {
    const [letters, setLetters] = useState([]);
    const [possibleWords, setPossibleWords] = useState([]);
    const [enteredWords, setEnteredWords] = useState([]);
    const [isGameEnded, setIsGameEnded] = useState(false);

    useEffect(() => {
        const { letters: dailyLetters, words } = getDailyLetters();
        setLetters(dailyLetters);
        setPossibleWords(words);
    }, []);

    const handleWordSubmit = (word) => {
        if (word.length > 3 && possibleWords.includes(word)) {
            setEnteredWords([...enteredWords, word]);
        }
    };

    const endGame = () => {
        setIsGameEnded(true);
    };

    return (
        <div className="App">
            <h1>Helenes Spill</h1>
            <GameBoard letters={letters} onWordSubmit={handleWordSubmit} />

        </div>
    );
}

export default App;
