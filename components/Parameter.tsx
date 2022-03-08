import { useState } from "react";
import Unknown from "./inputs/Unknown";
import Known from "./inputs/Known";

export const Parameter = ({
  parameter,
  onToggle,
  changeInput,
  segmentNumber,
  segment,
  toggleUnits,
}) => {
  //function to render input
  let renderInput = null;

  if (parameter.calculate) {
    renderInput = (
      <Known
        parameter={parameter}
        changeInput={changeInput}
        segmentNumber={segmentNumber}
      />
    );
  } else {
    renderInput = <Unknown parameter={parameter} />;
  }

  return (
    <>
      <div
        className={
          segment.forecastType === "exponential" &&
          (parameter.symbol === "df" || parameter.symbol === "b")
            ? "flex flex-row flex-auto bg-grey items-center h-8 p-6 w-96"
            : "flex flex-row flex-auto bg-grey items-center h-8 p-6 w-96"
        }
      >
        <div className="">
          <input
            type="checkbox"
            disabled={
              segment.forecastType === "exponential" &&
              (parameter.symbol === "df" || parameter.symbol === "b")
                ? true
                : false
            }
            onClick={() => {
              onToggle(parameter.symbol, segmentNumber);
            }}
          />
        </div>

        <div className="text-white text-xl w-10 text-center">
          {parameter.symbol}
        </div>
        {renderInput}
        <div className="container">
          <div
            className={
              parameter.symbol !== "b"
                ? " text-white bg-grey border-2 border-white m-auto w-28 text-center"
                : ""
            }
            onClick={() => {
              toggleUnits(parameter.symbol, segmentNumber);
            }}
          >
            {parameter.units}
          </div>
        </div>
      </div>
    </>
  );
};

export default Parameter;
