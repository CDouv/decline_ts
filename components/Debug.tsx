import React from "react";

export const Debug = ({
  calculateParameters,
  segmentsCheck,
  segments,
  countUnknowns,
}) => {
  return (
    <div>
      <button className="button" onClick={() => calculateParameters()}>
        Debug
      </button>
    </div>
  );
};

export default Debug;
