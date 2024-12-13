/* eslint-disable react/prop-types */
import React, { useState } from "react";

import { FaStar } from "react-icons/fa";

const Index = ({ totalStars = 5, onRateChange, disabled = false }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleRateChange = (rate) => {
    if (!disabled) {
      setRating(rate);
      if (onRateChange) {
        onRateChange(rate);
      }
    }
  };
  return (
    <div style={{ display: "flex" }}>
      {disabled &&
        [...Array(totalStars)].map((_, index) => (
          <FaStar key={index} size={16} color={"#ffc107"} />
        ))}
      {!disabled &&
        [...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <FaStar
              key={starValue}
              size={20}
              color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              style={{ cursor: "pointer", marginRight: "6px" }}
              onClick={() => handleRateChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
    </div>
  );
};

export default Index;
