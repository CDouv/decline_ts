import React from "react";

export const ErrorMessage = ({ segment }) => {
  return <div className="text-red text-center"> {segment.errMessage}</div>;
};

export default ErrorMessage;
