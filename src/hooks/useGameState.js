import { useState, useContext, createContext } from 'react';

// Create a Context for the game state
const GameStateContext = createContext();

// Custom hook to use the GameStateContext
export const useGameState = () => {
    return useContext(GameStateContext);
};

// Provider component to wrap your application
export const GameStateProvider = ({ children }) => {
    const [hasGivenUp, setHasGivenUp] = useState(false);

    const giveUp = () => {
        setHasGivenUp(true);
    };

    return (
        <GameStateContext.Provider value={{ hasGivenUp, giveUp }}>
            {children}
        </GameStateContext.Provider>
    );
};
