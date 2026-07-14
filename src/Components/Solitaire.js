import React, { useState } from 'react';
import '../Styles/Solitaire.css';

// Initial card matrix seed array configuration
const SUITS = [
  { symbol: '♠', color: 'black-suit' },
  { symbol: '♥', color: 'red-suit' },
  { symbol: '♦', color: 'red-suit' },
  { symbol: '♣', color: 'black-suit' }
];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function Solitaire() {
  const [currentCard, setCurrentCard] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Simulates pulling a random card out of an infinite deck sequence
  const drawCard = () => {
    const randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const randomValue = VALUES[Math.floor(Math.random() * VALUES.length)];
    
    setCurrentCard({
      value: randomValue,
      suit: randomSuit.symbol,
      colorClass: randomSuit.color
    });
  };

  // Puzzle match rule checks: Card sorting sorting mechanism
  const handleSortPile = (targetColor) => {
    if (!currentCard) return;

    // Checks if the user accurately sorted by red or black suits
    const isRedSuit = currentCard.colorClass === 'red-suit';
    const isCorrect = (targetColor === 'red' && isRedSuit) || (targetColor === 'black' && !isRedSuit);

    if (isCorrect) {
      setScore(prev => prev + 20 + (streak * 5));
      setStreak(prev => prev + 1);
    } else {
      setStreak(0); // Break current correct combination tracking
    }
    
    // Draw the next step card automatically
    drawCard();
  };

  const handleRestart = () => {
    setCurrentCard(null);
    setScore(0);
    setStreak(0);
  };

  return (
    <div className="solitaire-container">
      <div className="solitaire-scoreboard">
        SCORE: <span className="solitaire-score-val">{score}</span> 
        {streak > 1 && <span style={{color: '#ff3366', marginLeft: '15px'}}>🔥 x{streak}</span>}
      </div>

      <div className="solitaire-board-layout">
        
        {/* Slot 1: Central Draw Deck Pile */}
        <div className="solitaire-pile-zone">
          <span className="solitaire-pile-label">DECK PILE</span>
          <div className="solitaire-card-slot">
            {currentCard ? (
              <div className={`solitaire-playing-card ${currentCard.colorClass}`}>
                <div className="solitaire-card-value">{currentCard.value}</div>
                <div className="solitaire-card-suit-center">{currentCard.suit}</div>
                <div className="solitaire-card-value" style={{transform: 'rotate(180deg)'}}>{currentCard.value}</div>
              </div>
            ) : (
              <button onClick={drawCard} className="solitaire-control-btn" style={{padding: '8px 12px', fontSize: '12px'}}>
                Deal Card
              </button>
            )}
          </div>
        </div>

        {/* Slot 2: Red Card Sorting Stack */}
        <div className="solitaire-pile-zone">
          <span className="solitaire-pile-label" style={{color: '#ff3366'}}>♥ ♦ RED PILE</span>
          <div 
            onClick={() => handleSortPile('red')} 
            className="solitaire-card-slot" 
            style={{borderColor: '#ff3366', cursor: 'pointer'}}
          >
            <span style={{color: '#ff3366', opacity: 0.3, fontSize: '24px'}}>❤️</span>
          </div>
        </div>

        {/* Slot 3: Black Card Sorting Stack */}
        <div className="solitaire-pile-zone">
          <span className="solitaire-pile-label" style={{color: '#9aa0a6'}}>♠ ♣ BLACK PILE</span>
          <div 
            onClick={() => handleSortPile('black')} 
            className="solitaire-card-slot" 
            style={{borderColor: '#9aa0a6', cursor: 'pointer'}}
          >
            <span style={{color: '#9aa0a6', opacity: 0.3, fontSize: '24px'}}>♠️</span>
          </div>
        </div>

      </div>

      <p className="solitaire-info-tip">
        Click <b>Deal Card</b> to pull an entry. Tap the matching color deck container slots to score combo streak multipliers!
      </p>

      <button onClick={handleRestart} className="solitaire-control-btn">
        Reshuffle & Restart
      </button>
    </div>
  );
}
