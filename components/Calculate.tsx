import React from "react";

export const Calculate = ({ calculateParameters }) => {
  return (
    <div>
      <button
        className="text-light-grey hover:text-dark-grey"
        onClick={() => calculateParameters()}
      >
        <div className="text-xl ">Calculate</div>
      </button>
    </div>
  );
};

export default Calculate;
