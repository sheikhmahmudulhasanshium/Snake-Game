import React from 'react';

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
  return (
    <div className="flex flex-col items-center">
      {gameStarted && !gameOver && (
        <>
          <p className="mb-4 text-lg font-bold text-gray-800">Score: {score}</p>

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
          <p className="mb-4 text-lg">Final Score: {score}</p>

          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          >
            Retry
          </button>
        </>
      )}

      {!gameStarted && (
        <div className="flex items-center justify-center">
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
