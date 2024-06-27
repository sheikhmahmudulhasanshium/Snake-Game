"use client"
import React, { useState, useEffect, useRef } from 'react';
import FoodImage from '../../public/apple.png';
import SnakeHeadImage from '../../public/snake-head.png'; 
import SnakeBodyImage from '../../public/snake-body.png'; // Import snake body image
import JoyStick from './joy-stick';
import ScoreBoard from './scoreboard';

const GRID_SIZE = 20;

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<number[][]>([]);
  const [food, setFood] = useState<{ position: number[], image: HTMLImageElement | null }>({
    position: [],
    image: null,
  });
  const [direction, setDirection] = useState(Direction.Right);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  const [paused, setPaused] = useState(false);
  const [snakeHeadRotation, setSnakeHeadRotation] = useState(0); // State for snake head rotation
  const [gameStarted, setGameStarted] = useState(false);
  const [snakeHeadImage, setSnakeHeadImage] = useState<HTMLImageElement | null>(null);
  const [snakeBodyImage, setSnakeBodyImage] = useState<HTMLImageElement | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const canvasContext = canvasRef.current?.getContext('2d');
    if (canvasContext && snake.length > 0) {
      drawCanvas(canvasContext);
    }
  }, [snake, food, direction, snakeHeadRotation, snakeBodyImage]); // Include snakeBodyImage in dependencies

  useEffect(() => {
    const img = new Image();
    img.onload = function () {
      setSnakeHeadImage(img as HTMLImageElement); // Type assertion here
    };
    img.src = SnakeHeadImage.src;
  }, []);
  
  useEffect(() => {
    const img = new Image();
    img.onload = function () {
      setSnakeBodyImage(img as HTMLImageElement); // Type assertion here
    };
    img.src = SnakeBodyImage.src;
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = function () {
      setFood((prevFood) => ({
        ...prevFood,
        image: img as HTMLImageElement,
      }));
    };
    img.src = FoodImage.src;
  }, []);

  const initializeGame = () => {
    const initialSnake = [
      [10, 10],
      [9, 10],
      [8, 10],
    ];
    setSnake(initialSnake);

    setFood({
      position: randomPosition(),
      image: food.image,
    });

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
        setSnakeHeadRotation(180); // Rotate snake head 0 degrees (up)
        break;
      case Direction.Down:
        head[1]++;
        setSnakeHeadRotation(0); // Rotate snake head 180 degrees (down)
        break;
      case Direction.Left:
        head[0]--;
        setSnakeHeadRotation(90); // Rotate snake head 270 degrees (left)
        break;
      case Direction.Right:
        head[0]++;
        setSnakeHeadRotation(270); // Rotate snake head 90 degrees (right)
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head[0] === food.position[0] && head[1] === food.position[1]) {
      setFood({
        position: randomPosition(),
        image: food.image,
      });
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

    ctx.save(); // Save the current context state

    // Rotate canvas by snake head rotation
    ctx.translate((snake[0][0] + 0.5) * GRID_SIZE, (snake[0][1] + 0.5) * GRID_SIZE); // Translate to the center of the snake head
    ctx.rotate((snakeHeadRotation * Math.PI) / 180); // Rotate the context

    // Draw snake head as image (SnakeHeadImage)
    if (snakeHeadImage) {
      ctx.drawImage(snakeHeadImage, -GRID_SIZE / 2, -GRID_SIZE / 2, GRID_SIZE, GRID_SIZE); // Draw the rotated image
    }

    // Restore canvas state
    ctx.restore();

    // Draw snake body as images
    if (snakeBodyImage) {
      for (let i = 1; i < snake.length - 1; i++) {
        ctx.drawImage(snakeBodyImage, snake[i][0] * GRID_SIZE, snake[i][1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      }
    }

    // Draw snake tail as square
    if (snake.length > 1) {
      const tailX = snake[snake.length - 1][0] * GRID_SIZE;
      const tailY = snake[snake.length - 1][1] * GRID_SIZE;
      ctx.fillStyle = '#22C55E'; // Green color for snake tail
      ctx.fillRect(tailX, tailY, GRID_SIZE, GRID_SIZE);
    }

    // Draw food as image
    if (food.image) {
      ctx.drawImage(food.image, food.position[0] * GRID_SIZE, food.position[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  };

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
    if (paused || gameOver) return;

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

        {gameStarted && !gameOver && (
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
