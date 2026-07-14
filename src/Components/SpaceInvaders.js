import React, { useState, useEffect, useRef } from 'react';
import '../Styles/SpaceInvaders.css';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 450;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 15;
const ALIEN_SIZE = 25;
const GAME_DURATION = 30; 

// Tuning variables for the continuous engine
const SPAWN_INTERVAL_FRAMES = 150; // Spawns a new row roughly every 2.5 seconds
const HORIZONTAL_SPEED = 3;       // Smooth continuous sideways drifting speed

export default function SpaceInvaders() {
  const canvasRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('START'); 
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION); 
  
  const playerXRef = useRef(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
  const bulletsRef = useRef([]);
  const aliensRef = useRef([]);
  const spawnTimerRef = useRef(0);
  const keysPressedRef = useRef({});

  // Function to drop a brand new single row of aliens at the very top edge
  const spawnNewAlienRow = () => {
    const newRow = [];
    const cols = 6;
    for (let c = 0; c < cols; c++) {
      newRow.push({
        x: c * (ALIEN_SIZE + 25) + 40,
        y: 20, // Always starts at the top layout line
        direction: 1, // Individual horizontal tracking vector
        alive: true
      });
    }
    // Append the new row onto our existing running list of active aliens
    aliensRef.current = [...aliensRef.current, ...newRow];
  };

  // 30-second match countdown system
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          setGameState('WON'); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameState]);

  // Keyboard binding logic systems
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressedRef.current[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === ' ' && gameState === 'PLAYING') {
        if (bulletsRef.current.length < 5) { // Increased max active lasers to 5
          bulletsRef.current.push({
            x: playerXRef.current + PLAYER_WIDTH / 2 - 2,
            y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10
          });
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // High performance RAF game execution block
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const gameFrameUpdate = () => {
      // --- A. SHIP MOVEMENT ---
      if (keysPressedRef.current['ArrowLeft'] && playerXRef.current > 0) {
        playerXRef.current -= 9;
      }
      if (keysPressedRef.current['ArrowRight'] && playerXRef.current < CANVAS_WIDTH - PLAYER_WIDTH) {
        playerXRef.current += 9;
      }

      // --- B. PROJECTILE UPDATES ---
      bulletsRef.current = bulletsRef.current
        .map(b => ({ ...b, y: b.y - 10 }))
        .filter(b => b.y > 0);

      // --- C. CONTINUOUS SPAWN CLOCK CONTROLLERS ---
      spawnTimerRef.current += 1;
      if (spawnTimerRef.current >= SPAWN_INTERVAL_FRAMES) {
        spawnTimerRef.current = 0;
        spawnNewAlienRow(); // Adds a row at the top completely independent of the rest
      }

      // --- D. DYNAMIC ALIEN MOVEMENT ENGINE ---
      aliensRef.current.forEach(alien => {
        if (!alien.alive) return;

        // 1. Move horizontally constantly
        alien.x += HORIZONTAL_SPEED * alien.direction;

        // 2. Slow down and drop lower down if hitting canvas edges
        if (alien.x >= CANVAS_WIDTH - ALIEN_SIZE - 10) {
          alien.direction = -1;
          alien.y += 20; // Drops individual level closer to player base layout
        } else if (alien.x <= 10) {
          alien.direction = 1;
          alien.y += 20;
        }
      });

      // --- E. COLLISION CHECK MANIFESTS ---
      bulletsRef.current.forEach(bullet => {
        aliensRef.current.forEach(alien => {
          if (alien.alive &&
              bullet.x > alien.x && bullet.x < alien.x + ALIEN_SIZE &&
              bullet.y > alien.y && bullet.y < alien.y + ALIEN_SIZE) {
            alien.alive = false;
            bullet.y = -100; 
            setScore(prev => prev + 50);
          }
        });
      });

      // Filter out dead aliens completely from memory to keep the processing optimized
      aliensRef.current = aliensRef.current.filter(alien => alien.alive);

      // --- F. BREACHED DEFEAT CHECK ---
      const breached = aliensRef.current.some(a => a.y >= CANVAS_HEIGHT - PLAYER_HEIGHT - 30);
      if (breached) {
        setGameState('OVER');
        return;
      }

      // --- G. ART CANVAS RENDERING PIPELINE ---
      ctx.fillStyle = '#0b0c10'; 
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#66fcf1'; 
      ctx.fillRect(playerXRef.current, CANVAS_HEIGHT - PLAYER_HEIGHT - 10, PLAYER_WIDTH, PLAYER_HEIGHT);

      ctx.fillStyle = '#45f3ff';
      bulletsRef.current.forEach(b => {
        ctx.fillRect(b.x, b.y, 4, 10);
      });

      ctx.fillStyle = '#ff3366'; 
      aliensRef.current.forEach(alien => {
        ctx.fillRect(alien.x, alien.y, ALIEN_SIZE, ALIEN_SIZE);
        ctx.fillStyle = '#0b0c10';
        ctx.fillRect(alien.x + 4, alien.y + 6, 4, 4);
        ctx.fillRect(alien.x + ALIEN_SIZE - 8, alien.y + 6, 4, 4);
        ctx.fillStyle = '#ff3366'; 
      });

      animationFrameId = requestAnimationFrame(gameFrameUpdate);
    };

    animationFrameId = requestAnimationFrame(gameFrameUpdate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  const startGame = () => {
    playerXRef.current = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    bulletsRef.current = [];
    aliensRef.current = [];
    setScore(0);
    setTimeLeft(GAME_DURATION); 
    spawnTimerRef.current = 0;
    spawnNewAlienRow(); // Put out initial target lineup right out the gate
    setGameState('PLAYING');
  };

  return (
    <div className="space-container">
      <div className="space-scoreboard">
        <div>SCORE: <span className="space-score-val">{score}</span></div>
        <div>TIME LEFT: <span className="space-timer-val" style={{ color: timeLeft <= 10 ? '#ff3366' : '#66fcf1' }}>{timeLeft}s</span></div>
      </div>

      <div className="space-canvas-frame">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          className="space-canvas-layout"
        />

        {gameState === 'START' && (
          <div className="space-overlay">
            <button onClick={startGame} className="space-action-btn">
              Launch Fighter Ship
            </button>
          </div>
        )}

        {gameState === 'WON' && (
          <div className="space-overlay">
            <h2 className="space-win-text">TIME SURVIVED!</h2>
            <p style={{color: '#66fcf1', marginBottom: '20px'}}>Final Score: {score}</p>
            <button onClick={startGame} className="space-action-btn">
              Run Mission Again
            </button>
          </div>
        )}

        {gameState === 'OVER' && (
          <div className="space-overlay">
            <h2 className="space-over-text">LINE BREACHED!</h2>
            <button onClick={startGame} className="space-action-btn">
              Rebuild Fighter
            </button>
          </div>
        )}
      </div>

      <p className="space-tip">
        Warning: New alien rows are dropping in constantly! Shoot fast and stop them from reaching your defensive base line!
      </p>
    </div>
  );
}
