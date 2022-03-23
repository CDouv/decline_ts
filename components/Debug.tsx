import React from "react";

export const Debug = ({ calculateParameters }) => {
  return (
    <div>
      <button className="button" onClick={() => calculateParameters()}>
        Debug
      </button>
    </div>
  );
};

export default Debug;
