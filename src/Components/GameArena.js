import React from 'react';
import '../Styles/GameArena.css';

// 1. Swapped out the old Todo import for the clean new TicTacToe component
import TicTacToe from './TicTacToe'; 
import SnakeGame from './SnakeGame';
import BlockPuzzle from './BlockPuzzle';
import Solitaire from './Solitaire';
import SpaceInvaders from './SpaceInvaders';
import DartsMaster from './DartsMaster';

const GAMES_LIST = [
  { id: 'tictactoe', title: 'Tic-Tac-Toe Arena' },
  { id: 'snake', title: 'Retro Snake Classic' },
  { id: 'block', title: 'Block Puzzle' },
  { id: 'solitaire', title: 'Solitaire Suite' },
  { id: 'space', title: 'Space Invaders' },
  { id: 'darts', title: 'Darts Master' }
];

export default function GameArena({ gameId, onBack }) {
  const activeGame = GAMES_LIST.find(g => g.id === gameId);
  const gameName = activeGame ? activeGame.title : "Arcade Game";

  const renderSelectedGame = () => {
    switch (gameId) {
      case 'tictactoe':
        return <TicTacToe />; // 2. Rendering the proper clean component name now
      case 'snake':
        return <SnakeGame />;
      case 'block':
        return <BlockPuzzle />;
      case 'solitaire':
        return <Solitaire />;
      case 'space':
        return <SpaceInvaders />;
      case 'darts':
        return <DartsMaster />;
      default:
        return <div style={{color: '#fff'}}>Error: Game Not Found</div>;
    }
  };

  return (
    <div className="arena-root">
      <div className="arena-inner">
        
        <header className="arena-navbar">
          <button onClick={onBack} className="arena-back-action">
            ← Exit to Lobby
          </button>
          <span className="arena-badge">🕹️ ENGINE_LOADED</span>
        </header>

        <main className="arena-viewport">
          <div className="arena-active-game-box">
            <h1 className="arena-title" style={{ marginBottom: '30px' }}>{gameName}</h1>
            
            <div className="game-component-wrapper">
              {renderSelectedGame()}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
