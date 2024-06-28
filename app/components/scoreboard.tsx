import React from 'react';
import { ImageProps } from 'next/image'; // Import ImageProps for proper type checking
import Image from 'next/image'; // Import Image component from next/image
import logo from '../../public/snake-logo.png';

interface ScoreBoardProps {
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
  paused: boolean;
  handlePlay: () => void;
  togglePause: () => void;
  handleRetry: () => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  gameStarted,
  gameOver,
  paused,
  handlePlay,
  togglePause,
  handleRetry,
}) => {
  // Calculate level based on score
  const level = Math.floor(score / 100) + 1; // Start from level 1, increase every 100 score

  return (
    <div className="flex flex-col items-center">
      {gameStarted && !gameOver && (
        <>
          <p className="mb-4 text-lg font-bold text-gray-800">Score: {score}</p>
          <p className="mb-4 text-lg font-bold text-gray-800">Level: {level}</p>

          <button
            onClick={togglePause}
            className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-xl"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </>
      )}

      {gameStarted && gameOver && (
        <>
          <p className="mb-4 text-xl font-bold text-red-600">Game Over!</p>
          <p className="text-lg">Final Score: {score}</p>
          <p className="text-lg">Level: {level}</p>
          <Image src={logo as ImageProps['src']} alt="Logo" width={200} height={200} priority/>
          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          >
            Retry
          </button>
        </>
      )}

      {!gameStarted && (
        <div className="flex items-center justify-center flex-col">
          <Image src={logo as ImageProps['src']} alt="Logo" width={200} height={200} priority/>

          <button
            onClick={handlePlay}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
