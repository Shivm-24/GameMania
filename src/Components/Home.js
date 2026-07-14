import React, { useState } from 'react';
import '../Styles/Home.css'; // Make sure the path matches your project stylesheet location

const GAMES_DATA = [
  { id: 'tictactoe', title: 'Tic-Tac-Toe', category: 'Strategy', rating: '4.8', icon: '❌⭕' },
  { id: 'snake', title: 'Retro Snake', category: 'Arcade', rating: '4.5', icon: '🐍' },
  { id: 'block', title: 'Block Puzzle', category: 'Puzzle', rating: '4.2', icon: '🧱' },
  { id: 'solitaire', title: 'Solitaire Classic', category: 'Card', rating: '4.6', icon: '🃏' },
  { id: 'space', title: 'Space Invaders', category: 'Action', rating: '4.7', icon: '🚀' },
  { id: 'darts', title: 'Darts Master', category: 'Arcade', rating: '4.0', icon: '🎯' },
];

const CATEGORIES = ['All', 'Strategy', 'Arcade', 'Puzzle', 'Card', 'Action'];

export default function HomePage({ onSelectGame }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = GAMES_DATA.filter((game) => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-logo">🎮 GAME MANIA</div>
        <input 
          type="text" 
          placeholder="Search games..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="home-search-bar"
        />
      </header>

      <div className="home-categories-container">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`home-cat-btn ${selectedCategory === cat ? 'home-cat-btn-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="home-game-grid">
        {filteredGames.map((game) => (
          <div key={game.id} className="home-game-card">
            <div className="home-game-img">{game.icon}</div>
            <div className="home-game-info">
              <h3 className="home-game-title">{game.title}</h3>
              <div className="home-game-meta">
                <span>{game.category}</span>
                <span className="home-rating">⭐ {game.rating}</span>
              </div>
            </div>
            <button 
              onClick={() => onSelectGame?.(game.id)} 
              className="home-play-btn"
            >
              Launch Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
