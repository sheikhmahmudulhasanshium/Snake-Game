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
    <div className="grid grid-cols-3 gap-4 text-white text-3xl my-8  bottom-12 left-0 right-0 mx-8 opacity-25 sticky">
      <div onClick={() => handleDirection('up')} className="col-span-3 flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleUp  />
      </div>
      <div onClick={() => handleDirection('left')} className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleLeft  />
      </div>
      <div onClick={togglePause}  className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaCirclePause />
      </div>
      <div onClick={() => handleDirection('right')} className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleRight />
      </div>
      <div onClick={() => handleDirection('down')}  className="col-span-3 flex justify-center items-center bg-gray-700 hover:bg-gray-600 rounded-lg p-4 focus:outline-none">
        <FaChevronCircleDown  />
      </div>
    </div>
  );
};

export default JoyStick;
