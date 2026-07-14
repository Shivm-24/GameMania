import React, { useState } from 'react';
import '../Styles/BlockPuzzle.css';

// Initialize an empty 8x8 matrix template map
const createEmptyGrid = () => Array(8).fill(null).map(() => Array(8).fill(false));

export default function BlockPuzzle() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [score, setScore] = useState(0);

  // Handles clicking a cell to simulate block placement mechanics
  const handleCellClick = (rowIndex, colIndex) => {
    // If cell is already active, clear it out; otherwise activate it
    const newGrid = grid.map((row, rIdx) => 
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
    );

    // Scan for completely full rows or columns to trigger an instant line-clear
    let scoreMultiplier = 0;
    
    // 1. Identify rows to clear
    const rowsToClear = [];
    for (let r = 0; r < 8; r++) {
      if (newGrid[r].every(cell => cell === true)) rowsToClear.push(r);
    }

    // 2. Identify columns to clear
    const colsToClear = [];
    for (let c = 0; c < 8; c++) {
      let isColFull = true;
      for (let r = 0; r < 8; r++) {
        if (!newGrid[r][c]) {
          isColFull = false;
          break;
        }
      }
      if (isColFull) colsToClear.push(c);
    }

    // 3. Execute data updates and tally score points
    if (rowsToClear.length > 0 || colsToClear.length > 0) {
      scoreMultiplier = rowsToClear.length + colsToClear.length;
      
      // Wipe the cleared row tracks out of memory array mapping
      rowsToClear.forEach(r => {
        for (let c = 0; c < 8; c++) newGrid[r][c] = false;
      });

      // Wipe the cleared column tracks out of memory array mapping
      colsToClear.forEach(c => {
        for (let r = 0; r < 8; r++) newGrid[r][c] = false;
      });

      setScore(prev => prev + (scoreMultiplier * 80));
    } else {
      // Just normal item interaction scoring increment updates
      if (!grid[rowIndex][colIndex]) {
        setScore(prev => prev + 10);
      }
    }

    setGrid(newGrid);
  };

  const handleReset = () => {
    setGrid(createEmptyGrid());
    setScore(0);
  };

  return (
    <div className="puzzle-container">
      <div className="puzzle-score-board">
        SCORE: <span className="puzzle-score-val">{score}</span>
      </div>

      {/* Renders the full 8x8 functional grid field tracking loops */}
      <div className="puzzle-grid-matrix">
        {grid.map((row, rowIndex) =>
          row.map((isFilled, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`puzzle-cell ${isFilled ? 'filled' : ''}`}
            />
          ))
        )}
      </div>

      <p className="puzzle-tip">
        Click empty blocks to drop puzzle chunks. Filling a complete horizontal row or vertical column will trigger a line burst clear!
      </p>

      <button onClick={handleReset} className="puzzle-reset-btn">
        Clear Matrix Board
      </button>
    </div>
  );
}
