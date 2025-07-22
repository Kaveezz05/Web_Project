import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="spinner" />

      <style>{`
        .spinner {
          width: 56px;
          height: 56px;
          border: 5px solid #334155;
          border-top-color: #3b82f6; /* Blue */
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
