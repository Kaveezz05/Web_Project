import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-[#E5E9F0]">
      {text1}{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#E3E4FA]">
        {text2}
      </span>
    </h1>
  );
};

export default Title;
