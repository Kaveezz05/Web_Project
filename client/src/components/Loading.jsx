import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="spinner"></div>

      <style>{`
        .spinner {
          width: 56px;
          height: 56px;
          border: 5px solid #ccc;
          border-top-color: #ef4444; /* Tailwind red-500 */
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default Loading;
