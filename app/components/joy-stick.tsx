import React from 'react';
import {
  FaChevronCircleDown,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaChevronCircleUp,
} from 'react-icons/fa';
import { FaCirclePause } from 'react-icons/fa6';

interface JoyStickProps {
  handleDirection: (dir: string) => void; // Define handleDirection prop type
  togglePause: () => void; // Define togglePause prop type
}

const JoyStick: React.FC<JoyStickProps> = ({ handleDirection, togglePause }) => {
  return (
    <div className="grid grid-cols-3 gap-4 text-white text-3xl my-8 absolute bottom-0 left-0 right-0 mx-8">
      <div className="col-span-3 flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleUp onClick={() => handleDirection('up')} />
      </div>
      <div className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleLeft onClick={() => handleDirection('left')} />
      </div>
      <div className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaCirclePause onClick={togglePause} />
      </div>
      <div className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleRight onClick={() => handleDirection('right')} />
      </div>
      <div className="col-span-3 flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleDown onClick={() => handleDirection('down')} />
      </div>
    </div>
  );
};

export default JoyStick;
