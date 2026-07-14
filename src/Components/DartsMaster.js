import React, { useState, useEffect, useRef } from 'react';
import '../Styles/DartsMaster.css';

const CANVAS_SIZE = 440;
const CENTER = CANVAS_SIZE / 2;

export default function DartsMaster() {
  const canvasRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [power, setPower] = useState(0);
  const [isAiming, setIsAiming] = useState(true);
  const [lastHit, setLastHit] = useState("");

  const aimAngleRef = useRef(0);
  const aimDirectionRef = useRef(1);
  const powerDirectionRef = useRef(1);

  // 1. Centralized Game Loop Clock Engine (Handles target sweep & power gauge loops)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const gameLoopUpdate = () => {
      // --- A. AIM LINE ANGLE SWEEP CALCULATIONS ---
      if (isAiming) {
        aimAngleRef.current += 0.04 * aimDirectionRef.current;
        if (aimAngleRef.current > Math.PI / 4 || aimAngleRef.current < -Math.PI / 4) {
          aimDirectionRef.current *= -1; // Boundary sweep bounce back
        }
      } else {
        // --- B. POWER METER OSCILLATION LOOP ---
        setPower(prev => {
          let nextPower = prev + 4 * powerDirectionRef.current;
          if (nextPower >= 100 || nextPower <= 0) {
            powerDirectionRef.current *= -1;
          }
          return nextPower;
        });
      }

      // --- C. RADIAL TARGET CANVAS RENDERING ---
      ctx.fillStyle = '#0b0c10';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw Outer Scoring Concentric Rings
      ctx.fillStyle = '#1f2833';
      ctx.strokeStyle = '#2f3b4c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw Mid Segment Circle Ring
      ctx.fillStyle = '#151c24';
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw Inner Ring Track
      ctx.fillStyle = '#ff3366'; // Vibrant Ring Accent
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw Center Bullseye Core Target Point
      ctx.fillStyle = '#66fcf1'; // Neon Cyan Bullseye Asset
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // --- D. DRAW OSCILLATING AIM SELECTOR LINE ---
      if (isAiming) {
        ctx.strokeStyle = 'rgba(102, 252, 241, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(CENTER, CANVAS_SIZE - 20);
        
        // Calculate dynamic projection vectors based on active radian sweep
        const targetX = CENTER + Math.sin(aimAngleRef.current) * 360;
        const targetY = (CANVAS_SIZE - 20) - Math.cos(aimAngleRef.current) * 360;
        
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      }
    };

    const runInterval = setInterval(gameLoopUpdate, 1000 / 60); // Stable 60FPS Render Frame Clock
    return () => clearInterval(runInterval);
  }, [isAiming]);

  // 2. Physics Vector Calculation Engine (Calculates entry impact coordinate rings)
  const handleThrowAction = () => {
    if (isAiming) {
      // Lock target line vector angle, pass control loop over to the power gauge meter
      setIsAiming(false);
    } else {
      // Calculate final target board coordinates based on user input accuracy thresholds
      const currentAngle = aimAngleRef.current;
      
      // Power variable variance calculation handles dart height impact positioning offset parameters
      const baselineFlightLength = 320;
      const velocityOffsetModifier = (power / 100) * 80; 
      const totalFlightDistance = baselineFlightLength + velocityOffsetModifier;

      const impactX = CENTER + Math.sin(currentAngle) * (totalFlightDistance - 150);
      const impactY = (CANVAS_SIZE - 20) - Math.cos(currentAngle) * totalFlightDistance;

      // Compute geometric distance offset relative to exact center node map points
      const dx = impactX - CENTER;
      const dy = impactY - CENTER;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

      // --- POINT SECTOR MATRIX INTERSECTION TALLIES ---
      let pointsScored = 0;
      let hitRegionMessage = "Miss!";

      if (distanceFromCenter <= 15) {
        pointsScored = 100;
        hitRegionMessage = "🎯 PERFECT BULLSEYE!";
      } else if (distanceFromCenter <= 50) {
        pointsScored = 50;
        hitRegionMessage = "⭕ Inner Circle Ring";
      } else if (distanceFromCenter <= 110) {
        pointsScored = 30;
        hitRegionMessage = "⭐ Mid Segment Field";
      } else if (distanceFromCenter <= 180) {
        pointsScored = 10;
        hitRegionMessage = "Outer Zone Trace";
      }

      setScore(prev => prev + pointsScored);
      setLastHit(hitRegionMessage);

      // Reset application loop clock flags safely back to default initialization frames
      setIsAiming(true);
      setPower(0);
    }
  };

  return (
    <div className="darts-container">
      <div className="darts-scoreboard">
        SCORE: <span className="darts-score-val">{score}</span>
        {lastHit && <div style={{ fontSize: '14px', color: '#ff3366', marginTop: '5px', textAlign: 'center' }}>{lastHit}</div>}
      </div>

      <div className="darts-canvas-frame">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          className="darts-canvas-layout"
        />
      </div>

      {/* Dynamic Action Multi-State Power Meter Gauge Slider */}
      <div className="darts-power-bar-wrapper">
        <div 
          className="darts-power-indicator" 
          style={{ width: `${isAiming ? 0 : power}%` }}
        />
      </div>

      <button onClick={handleThrowAction} className="darts-action-btn">
        {isAiming ? "Lock Aim Target" : "Release Throw!"}
      </button>

      <p className="darts-tip">
        Tap <b>Lock Aim Target</b> when the laser alignment vector sweeps center. Click <b>Release Throw!</b> to balance weight projection speed!
      </p>
    </div>
  );
}
