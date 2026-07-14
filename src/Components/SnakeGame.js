import React, { useState, useEffect, useRef } from 'react';
import '../Styles/SnakeGame.css';

const GRID_SIZE = 20;
const DEFAULT_CANVAS_SIZE = 400;
const SPEED = 150;

const INITIAL_SNAKE = [[10, 10], [10, 11], [10, 12]];
const INITIAL_FOOD = [5, 5];
const INITIAL_DIR = [0, -1];

export default function SnakeGame() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [canvasSize, setCanvasSize] = useState(DEFAULT_CANVAS_SIZE);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [dir, setDir] = useState(INITIAL_DIR);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Monitor browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFull = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFull);
      
      if (isCurrentlyFull) {
        const minDimension = Math.min(window.innerWidth, window.innerHeight) - 100;
        const optimizedSize = Math.floor(minDimension / GRID_SIZE) * GRID_SIZE;
        setCanvasSize(optimizedSize);
      } else {
        setCanvasSize(DEFAULT_CANVAS_SIZE);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error enabling fullscreen:", err);
      }
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (dir[1] !== 1) setDir([0, -1]); break;
        case 'ArrowDown': if (dir[1] !== -1) setDir([0, 1]); break;
        case 'ArrowLeft': if (dir[0] !== 1) setDir([-1, 0]); break;
        case 'ArrowRight': if (dir[0] !== -1) setDir([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (!isStarted || gameOver) return;
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = [newSnake[0][0] + dir[0], newSnake[0][1] + dir[1]];

      if (
        head[0] < 0 || head[0] >= canvasSize / GRID_SIZE || 
        head[1] < 0 || head[1] >= canvasSize / GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      for (const segment of newSnake) {
        if (head[0] === segment[0] && head[1] === segment[1]) {
          setGameOver(true);
          return;
        }
      }
      newSnake.unshift(head);
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore((prev) => prev + 10);
        generateNewFood(newSnake);
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    };
    const gameLoop = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameLoop);
  }, [snake, dir, food, gameOver, isStarted, canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#151c24';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = '#ff3366';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff3366';
    ctx.fillRect(food[0] * GRID_SIZE, food[1] * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#66fcf1';
    snake.forEach(([x, y], index) => {
      ctx.fillStyle = index === 0 ? '#66fcf1' : '#45f3ff';
      ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    ctx.shadowBlur = 0;
  }, [snake, food, canvasSize]);

  const generateNewFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = [
        Math.floor(Math.random() * (canvasSize / GRID_SIZE)),
        Math.floor(Math.random() * (canvasSize / GRID_SIZE))
      ];
      const hitSnake = currentSnake.some(seg => seg[0] === newFood[0] && seg[1] === newFood[1]);
      if (!hitSnake) break;
    }
    setFood(newFood);
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDir(INITIAL_DIR);
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
  };

  return (
    <div ref={containerRef} className={`snake-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="snake-score-board">
        SCORE: <span className="snake-score-val">{score}</span>
        <button onClick={toggleFullscreen} className="snake-fullscreen-btn">
          {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
        </button>
      </div>
      <div className="snake-canvas-frame" style={{ width: canvasSize, height: canvasSize }}>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className="snake-canvas-layout" />
        {!isStarted && !gameOver && (
          <div className="snake-overlay">
            <button onClick={() => setIsStarted(true)} className="snake-action-btn">
              Start Game
            </button>
          </div>
        )}
        {gameOver && (
          <div className="snake-overlay">
            <h2 className="snake-over-text">GAME OVER</h2>
            <button onClick={restartGame} className="snake-action-btn">
              Play Again
            </button>
          </div>
        )}
      </div>
      <p className="snake-tip">Use your keyboard ⬆ ⬇ ⬅ ➡ Arrow keys to navigate!</p>
    </div>
  );
}
