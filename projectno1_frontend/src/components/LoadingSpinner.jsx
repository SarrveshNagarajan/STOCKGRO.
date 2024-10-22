import React from 'react';
import { ProgressBar } from 'react-loader-spinner';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        color="#00df9a"
        ariaLabel="progress-bar-loading"
        barColor='#00df9a'
        borderColor='#000000'
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default LoadingSpinner;