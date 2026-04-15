import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction, GameState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    setGameState((prev) => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Check food
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, gameState.isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          if (gameState.direction !== 'DOWN') setGameState(prev => ({ ...prev, direction: 'UP' }));
          break;
        case 'arrowdown':
        case 's':
          if (gameState.direction !== 'UP') setGameState(prev => ({ ...prev, direction: 'DOWN' }));
          break;
        case 'arrowleft':
        case 'a':
          if (gameState.direction !== 'RIGHT') setGameState(prev => ({ ...prev, direction: 'LEFT' }));
          break;
        case 'arrowright':
        case 'd':
          if (gameState.direction !== 'LEFT') setGameState(prev => ({ ...prev, direction: 'RIGHT' }));
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
        case 'r':
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : 'rgba(0, 243, 255, 0.4)';
      ctx.shadowBlur = isHead ? 15 : 0;
      ctx.shadowColor = '#00f3ff';
      
      // Rounded segments
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 2);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#ff007a';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff007a';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }, [gameState]);

  const resetGame = () => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 5, y: 5 },
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2 font-mono">
      <div className="flex items-center justify-between w-full max-w-[400px] bg-[#0f0f12] p-2 border border-[#00f3ff]/30">
        <div className="bg-[#00f3ff]/10 border border-[#00f3ff] px-3 py-1 text-[#00f3ff] text-xs">
          SCORE: {gameState.score.toString().padStart(6, '0')}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
            disabled={gameState.isGameOver}
            className="border-[#00f3ff]/30 bg-transparent text-[#00f3ff] hover:bg-[#00f3ff]/10 rounded-none w-8 h-8"
          >
            {gameState.isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetGame}
            className="border-[#00f3ff]/30 bg-transparent text-[#00f3ff] hover:bg-[#00f3ff]/10 rounded-none w-8 h-8"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <motion.div 
        className="relative group"
        animate={gameState.isGameOver ? { x: [-4, 4, -4, 4, 0], y: [2, -2, 2, -2, 0] } : {}}
        transition={{ duration: 0.2, repeat: gameState.isGameOver ? 2 : 0 }}
      >
        <div className="absolute -inset-0.5 bg-[#ff007a] opacity-20 blur-[2px]"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black border border-[#00f3ff]/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] touch-none"
        />

        <AnimatePresence>
          {(gameState.isGameOver || (gameState.isPaused && gameState.score === 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8 text-center z-50"
            >
              {gameState.isGameOver ? (
                <>
                  <h2 className="text-3xl font-mono glitch-text text-[#ff007a] mb-4 uppercase tracking-widest">CRITICAL_FAILURE</h2>
                  <p className="text-[#00f3ff] mb-8 text-[10px] uppercase tracking-widest">Score_Logged: {gameState.score}</p>
                  <Button onClick={resetGame} className="bg-[#ff007a] hover:bg-[#ff007a]/80 text-black font-bold rounded-none px-10 py-6 text-xs uppercase tracking-widest">
                    REBOOT_SYSTEM
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-mono glitch-text text-[#00f3ff] mb-4 uppercase tracking-widest">NEURAL_LINK_READY</h2>
                  <p className="text-[#ff007a] mb-8 text-[10px] uppercase tracking-widest">Input_Required: [SPACE]</p>
                  <Button onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))} className="bg-[#00f3ff] hover:bg-[#00f3ff]/80 text-black font-bold rounded-none px-10 py-6 text-xs uppercase tracking-widest">
                    INITIALIZE_LINK
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
