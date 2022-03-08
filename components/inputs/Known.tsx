import React from "react";
import { useState } from "react";
import Parameter from "../Parameter";

export const Known = ({ parameter, segmentNumber, changeInput }) => {
  const [param, setParam] = useState("");
  const [paramError, setParamError] = useState("false");

  const validateParam = (val) => {
    if (isNaN(val)) {
      setParamError("true");
    } else {
      setParamError("false");
    }

    console.log(paramError);
  };

  return (
    <div className={`${paramError === "true" ? "bg-red w-32" : "w-28"}`}>
      <form className="">
        <input
          className="w-24"
          type="number"
          value={parameter.input}
          onChange={(e) => {
            console.log(e.target.value);
            validateParam(e.target.value);
            setParam(e.target.value);
            changeInput(parameter.symbol, e.target.value, segmentNumber);
          }}
        />
      </form>
    </div>
  );
};

export default Known;
