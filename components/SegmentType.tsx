import React from "react";

export const SegmentType = ({
  segment,
  changeSegmentType,
  clearInputs,
  segmentNumber,
}) => {
  return (
    <>
      <div className="container w-96 flex flex-col items-center justify-center p-2">
        <div className="text-black text-2xl text-center">segment type</div>
        <div className="flex flex-row p-2">
          <button
            className={
              segment.forecastType === "exponential"
                ? "w-[192px] bg-white text-dark-grey text-2xl"
                : "w-[192px] bg-light-red text-dark-red text-2xl"
            }
            onClick={() => {
              segment.forecastType !== "exponential"
                ? changeSegmentType(segmentNumber)
                : "";
            }}
          >
            exponential
          </button>
          <button
            className={
              segment.forecastType === "hyperbolic"
                ? "w-[192px] bg-white text-dark-grey text-2xl"
                : "w-[192px] bg-light-red text-dark-red text-2xl"
            }
            onClick={() => {
              segment.forecastType !== "hyperbolic"
                ? changeSegmentType(segmentNumber)
                : "";
            }}
          >
            hyperbolic
          </button>
        </div>
      </div>
    </>
  );
};

export default SegmentType;
