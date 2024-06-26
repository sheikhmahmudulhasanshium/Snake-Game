"use client"
import React, { useState, useEffect, useRef } from 'react';
import appleImage from '../../public/apple.png'; // Ensure correct path to your image

const GRID_SIZE = 20;

enum Direction {
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

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeGame();
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

  useEffect(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    if (canvasContext && snake.length > 0) {
      canvasContext.clearRect(0, 0, GRID_SIZE * 20, GRID_SIZE * 20);

      // Draw snake head (semi-circle 'D' shape)
      const [headX, headY] = snake[0];
      const headSize = GRID_SIZE;

      canvasContext.fillStyle = '#34D399'; // Green color for snake head

      canvasContext.beginPath();
      if (direction === Direction.Right || direction === Direction.Left) {
        // Horizontal head
        const radius = headSize / 2;
        const centerY = headY * GRID_SIZE + radius;
        const startX = headX * GRID_SIZE + (direction === Direction.Right ? radius : headSize - radius);
        const endX = headX * GRID_SIZE + (direction === Direction.Right ? headSize : 0);
        canvasContext.arc(startX, centerY, radius, Math.PI / 2, -Math.PI / 2, direction === Direction.Right);
        canvasContext.lineTo(endX, centerY + radius);
      } else {
        // Vertical head (default to Up)
        const radius = headSize / 2;
        const centerX = headX * GRID_SIZE + radius;
        const startY = headY * GRID_SIZE + (direction === Direction.Down ? radius : headSize - radius);
        const endY = headY * GRID_SIZE + (direction === Direction.Down ? headSize : 0);
        canvasContext.arc(centerX, startY, radius, Math.PI, 0, direction === Direction.Down);
        canvasContext.lineTo(centerX + radius, endY);
      }
      canvasContext.fill();

      // Draw snake body
      canvasContext.fillStyle = '#22C55E'; // Green color for snake body
      for (let i = 1; i < snake.length - 1; i++) {
        canvasContext.fillRect(snake[i][0] * GRID_SIZE, snake[i][1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }

      // Draw snake tail as square
      if (snake.length > 1) {
        const tailX = snake[snake.length - 1][0] * GRID_SIZE;
        const tailY = snake[snake.length - 1][1] * GRID_SIZE;
        canvasContext.fillRect(tailX, tailY, GRID_SIZE, GRID_SIZE);
      }

      // Draw food as apple image
      const img = new Image();
      img.onload = function () {
        canvasContext.drawImage(img, food[0] * GRID_SIZE, food[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      };
      img.src = appleImage.src; // Use the .src property here to get the URL
    }
  }, [snake, food]);

  const handleRetry = () => {
    initializeGame();
  };

  return (
    <div className="flex justify-center">
      <div className="mt-8">
        <p className="mb-4 text-lg font-bold text-gray-800">Score: {score}</p>
        {!gameOver && (
          <div className="flex flex-col items-center">
            <button onClick={togglePause} className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl ">
              {paused ? 'Resume' : 'Pause'}
            </button>
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * 20}
              height={GRID_SIZE * 20}
              style={{ border: '6px solid', borderColor: '#BC4A3C' }}
            />
          </div>
        )}
        {gameOver && (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-xl font-bold text-red-600">Game Over!</p>
            <p className="mb-4 text-lg">Final Score: {score}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
