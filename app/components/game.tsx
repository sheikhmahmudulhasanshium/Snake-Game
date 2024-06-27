"use client"
import React, { useState, useEffect, useRef } from 'react';
import appleImage from '../../public/apple.png'; // Ensure correct path to your image
import JoyStick from './joy-stick';
import ScoreBoard from './scoreboard';
const GRID_SIZE = 20;

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<number[][]>([]);
  const [food, setFood] = useState<number[]>([]);
  const [direction, setDirection] = useState(Direction.Right);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  const [paused, setPaused] = useState(false);
  const [appleImageObj, setAppleImageObj] = useState<HTMLImageElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    if (canvasContext && snake.length > 0) {
      drawCanvas(canvasContext);
    }
  }, [snake, food, direction, appleImageObj]);

  const initializeGame = () => {
    const initialSnake = [
      [10, 10],
      [9, 10],
      [8, 10],
    ];
    setSnake(initialSnake);

    setFood(randomPosition());

    setDirection(Direction.Right);
    setGameOver(false);
    setScore(0);
    setSpeed(150);
    setPaused(false);
  };

  const randomPosition = (): number[] => [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
  ];

  const checkCollision = (head: number[]): boolean => {
    if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i][0] === head[0] && snake[i][1] === head[1]) {
        return true;
      }
    }

    return false;
  };

  const moveSnake = () => {
    if (gameOver || paused) return;

    const newSnake = [...snake];
    const head = [...newSnake[0]];

    switch (direction) {
      case Direction.Up:
        head[1]--;
        break;
      case Direction.Down:
        head[1]++;
        break;
      case Direction.Left:
        head[0]--;
        break;
      case Direction.Right:
        head[0]++;
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(randomPosition());
      setScore(score + 10);
      setSpeed(speed - 5);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'w':
      case 'arrowup':
        if (direction !== Direction.Down) setDirection(Direction.Up);
        break;
      case 's':
      case 'arrowdown':
        if (direction !== Direction.Up) setDirection(Direction.Down);
        break;
      case 'a':
      case 'arrowleft':
        if (direction !== Direction.Right) setDirection(Direction.Left);
        break;
      case 'd':
      case 'arrowright':
        if (direction !== Direction.Left) setDirection(Direction.Right);
        break;
      case 'p':
      case ' ':
        togglePause();
        break;
      default:
        break;
    }
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const handleRetry = () => {
    initializeGame();
    setGameStarted(true);
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, GRID_SIZE * 20, GRID_SIZE * 20);

    // Draw snake head (semi-circle 'D' shape)
    const [headX, headY] = snake[0];
    const headSize = GRID_SIZE;

    ctx.fillStyle = '#34D399'; // Green color for snake head

    ctx.beginPath();
    if (direction === Direction.Right || direction === Direction.Left) {
      // Horizontal head
      const radius = headSize / 2;
      const centerY = headY * GRID_SIZE + radius;
      const startX = headX * GRID_SIZE + (direction === Direction.Right ? radius : headSize - radius);
      const endX = headX * GRID_SIZE + (direction === Direction.Right ? headSize : 0);
      ctx.arc(startX, centerY, radius, Math.PI / 2, -Math.PI / 2, direction === Direction.Right);
      ctx.lineTo(endX, centerY + radius);
    } else {
      // Vertical head (default to Up)
      const radius = headSize / 2;
      const centerX = headX * GRID_SIZE + radius;
      const startY = headY * GRID_SIZE + (direction === Direction.Down ? radius : headSize - radius);
      const endY = headY * GRID_SIZE + (direction === Direction.Down ? headSize : 0);
      ctx.arc(centerX, startY, radius, Math.PI, 0, direction === Direction.Down);
      ctx.lineTo(centerX + radius, endY);
    }
    ctx.fill();

    // Draw snake body
    ctx.fillStyle = '#22C55E'; // Green color for snake body
    for (let i = 1; i < snake.length - 1; i++) {
      ctx.fillRect(snake[i][0] * GRID_SIZE, snake[i][1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    // Draw snake tail as square
    if (snake.length > 1) {
      const tailX = snake[snake.length - 1][0] * GRID_SIZE;
      const tailY = snake[snake.length - 1][1] * GRID_SIZE;
      ctx.fillRect(tailX, tailY, GRID_SIZE, GRID_SIZE);
    }

    // Draw food as apple image
    if (appleImageObj) {
      ctx.drawImage(appleImageObj, food[0] * GRID_SIZE, food[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.onload = function () {
      setAppleImageObj(img);
    };
    img.src = appleImage.src;
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);

    if (paused || gameOver) {
      clearInterval(interval);
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [snake, food, direction, speed, gameOver, paused]);

  const handlePlay = () => {
    initializeGame();
    setGameStarted(true);
  };

  const handleDirection = (dir: string) => {
    switch (dir) {
      case 'up':
        if (direction !== Direction.Down) setDirection(Direction.Up);
        break;
      case 'down':
        if (direction !== Direction.Up) setDirection(Direction.Down);
        break;
      case 'left':
        if (direction !== Direction.Right) setDirection(Direction.Left);
        break;
      case 'right':
        if (direction !== Direction.Left) setDirection(Direction.Right);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-8">
        <ScoreBoard
          score={score}
          gameStarted={gameStarted}
          gameOver={gameOver}
          paused={paused}
          handlePlay={handlePlay}
          togglePause={togglePause}
          handleRetry={handleRetry}
        />

        {gameStarted && !gameOver&&(
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * 20}
              height={GRID_SIZE * 20}
              style={{ border: '6px solid', borderColor: '#BC4A3C' }}
            />
            <JoyStick handleDirection={handleDirection} togglePause={togglePause} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
