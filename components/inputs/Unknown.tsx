//Will eventually use this component to talk to Rust and calculate unknown value
import React from "react";
import Parameter from "../Parameter";

export const Unknown = ({ parameter }) => {
  return (
    <div className="w-28">
      <form className="container">
        <input type="text" value={parameter.input} className="w-24" readOnly />
      </form>
    </div>
  );
};

export default Unknown;
