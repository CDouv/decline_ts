import React from "react";

export const ClearInputs = ({ clearInputs, segments }) => {
  return (
    <div>
      <button className="button" onClick={() => clearInputs()}>
        <div className="">Clear</div>
      </button>
    </div>
  );
};

export default ClearInputs;
