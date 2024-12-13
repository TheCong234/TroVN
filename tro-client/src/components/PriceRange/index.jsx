import React, { useState } from 'react';

const PriceRange = ({ min, max, onChange = () => {} }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxValue - 1);
    setMinValue(value);
    onChange([value, maxValue]);
  };

  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minValue + 1);
    setMaxValue(value);
    onChange([minValue, value]);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-2">
        {/* Thanh màu nền */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-300 rounded"></div>
        {/* Thanh màu chính */}
        <div
          className="absolute top-0 h-2 bg-blue-500 rounded"
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
          }}
        />
        {/* Thanh trượt min */}
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto thumb:z-10"
          style={{ zIndex: 3 }}
        />
        {/* Thanh trượt max */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto thumb:z-20"
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
};

export default PriceRange;
