import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Firework = styled.div.attrs((props) => ({
    style: {
        top: `${props.top}px`,
        left: `${props.left}px`,
    },
}))`
    position: fixed;
    width: ${(props) => `${props.size}px`};
    height: ${(props) => `${props.size}px`};
    border-radius: 50%;
    background-color: ${(props) => props.color};
    animation: explode ${(props) => `${Math.random() * 1 + 1}s`} ease-out forwards;
    pointer-events: none;
    opacity: 1;

    @keyframes explode {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(3);
        }
    }
`;

const FanfareContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
`;

const FanfareText = styled.div`
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    font-size: 3rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.7);
    animation: fadeInOut 3s ease-out forwards;
    z-index: 1001;

    @keyframes fadeInOut {
        0%, 80% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;

const Fanfare = () => {
    const [fireworks, setFireworks] = useState([]);

    const triggerFanfare = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const newFireworks = [];

        for (let i = 0; i < 30; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const randomSize = Math.random() * 30 + 15;

            newFireworks.push(
                <Firework
                    key={i}
                    size={randomSize}
                    color={randomColor}
                    top={y}
                    left={x}
                />
            );
        }

        setFireworks(newFireworks);

        // Remove fireworks after animation
        setTimeout(() => {
            setFireworks([]);
        }, 2000);
    };

    useEffect(() => {
        triggerFanfare();
    }, []);

    return (
        <FanfareContainer>
            {fireworks}
            <FanfareText>Wow, du klarte et langt ord!</FanfareText>
        </FanfareContainer>
    );
};

export default Fanfare;
