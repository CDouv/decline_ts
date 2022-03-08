import React from "react";

export const DeleteSegment = ({ deleteSegment }) => {
  return (
    <div>
      <button className="button" onClick={() => deleteSegment()}>
        <div className=" w-10 h-10 rounded-full border-2 flex justify-center items-center text-center text-4xl text-dark-grey bg-dark-red">
          -
        </div>
      </button>
    </div>
  );
};

export default DeleteSegment;
