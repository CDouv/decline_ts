import Header from "../components/Header";
import Parameters from "../components/Parameters";
import Calculate from "../components/Calculate";
import Debug from "../components/Debug";
import AddSegment from "../components/AddSegment";
import DeleteSegment from "../components/DeleteSegment";
import ClearInputs from "../components/ClearInputs";
import SegmentType from "../components/SegmentType";
import { Exponential, Hyperbolic } from "../lib/declineEquations";
import { useState } from "react";
// import { queries } from "@testing-library/react";
import { isCompositeComponent } from "react-dom/test-utils";

// const axios = require("axios").default;

const App = () => {
  const [param, setParam] = useState("");
  const [paramError, setParamError] = useState("false");
  const [segments, setSegments] = useState([
    {
      product: "oil",
      segmentNumber: 1,
      forecastType: "exponential",
      unknownsCount: 0,
      canCalcUnknowns: false,
      errMessage: "",
      parameters: [
        {
          text: "Initial Flow Rate",
          symbol: "qi",
          units: "bbl/d",
          calculate: false,
          input: undefined,
        },

        {
          text: "Final Flow Rate",
          symbol: "qf",
          units: "bbl/d",
          calculate: false,
          input: undefined,
        },
        {
          text: "Initial Decline Rate",
          symbol: "di",
          units: "nominal %/yr",
          calculate: false,
          input: undefined,
        },

        {
          text: "Final Decline Rate",
          symbol: "df",
          units: "nominal %/yr",
          calculate: false,
          input: undefined,
        },

        {
          text: "Segment Duration",
          symbol: "t",
          units: "years",
          calculate: false,
          input: undefined,
        },

        {
          text: "Segment Reserves",
          symbol: "np",
          units: "mbbl",
          calculate: false,
          input: undefined,
        },
        {
          text: "Decline Exponent",
          symbol: "b",
          units: "",
          calculate: false,
          input: undefined,
        },
      ],
    },
  ]);

  //Create a state to track whether segment has been checked/approved to go into calculator
  const [inputCheck, setInputCheck] = useState([false]);

  const toggleChangeInput = (symbol, val, segmentNumber) => {
    //Determine parameters to reference
    let params = segments[segmentNumber - 1].parameters;
    //Copy parameter, change inputs
    let newParameters = params.map((parameter) => {
      if (parameter.symbol === symbol) {
        //check if value is a number

        if (isNaN(val.trim()) || val.trim().length === 0) {
          return { ...parameter, input: val };
        } else {
          return { ...parameter, input: parseFloat(val) };
        }
      } else {
        return parameter;
      }
    });

    //Copy segments, add in new parameters
    let newSegments = segments.map((seg) => {
      return { ...seg };
    });
    newSegments[segmentNumber - 1].parameters = newParameters;

    return setSegments(newSegments);
  };
  const changeSegmentType = (segmentNumber) => {
    let selectedSegmentType;
    let segCopy = segments.map((seg) => {
      return { ...seg };
    });

    segCopy = segCopy.map((seg) => {
      if (seg.segmentNumber === segmentNumber) {
        let newParameters = seg.parameters.map((param) => {
          return { ...param, calculate: false, input: "" };
        });

        if (seg.forecastType === "hyperbolic") {
          selectedSegmentType = "exponential";
        } else if (seg.forecastType === "exponential") {
          selectedSegmentType = "hyperbolic";
        }

        let newSegment = {
          ...seg,
          forecastType: selectedSegmentType,
          parameters: newParameters,
        };

        return newSegment;
      } else {
        return seg;
      }
    });

    setSegments(segCopy);
  };
  const toggleCalculate = (symbol, segmentNumber) => {
    //Determine parameters to reference
    let params = segments[segmentNumber - 1].parameters;
    //Copy parameter, change calculate field
    let newParameters = params.map((parameter) => {
      if (parameter.symbol === symbol) {
        const newCalculate = !parameter.calculate;
        if (newCalculate) {
          return { ...parameter, calculate: newCalculate, input: undefined };
        } else {
          return { ...parameter, calculate: newCalculate, input: undefined };
        }
      } else {
        return parameter;
      }
    });
    //Copy segments, add in new parameters
    let newSegments = segments.map((seg) => {
      return { ...seg };
    });
    newSegments[segmentNumber - 1].parameters = newParameters;

    return setSegments(newSegments);
  };

  const toggleUnits = (symbol, segmentNumber) => {
    //Determine parameters to reference
    let params = segments[segmentNumber - 1].parameters;
    //Copy parameter, change units and convert value
    let newParameters = params.map((parameter) => {
      if (parameter.symbol === symbol) {
        if (parameter.symbol === "di" || parameter.symbol === "df") {
          if (typeof parameter.input === "number") {
            switch (parameter.units) {
              case "nominal %/yr":
                return { ...parameter, units: "secant effective %/yr" };
              case "secant effective %/yr":
                return { ...parameter, units: "nominal %/yr" };
            }
          } else {
            switch (parameter.units) {
              case "nominal %/yr":
                return { ...parameter, units: "secant effective %/yr" };
              case "secant effective %/yr":
                return { ...parameter, units: "nominal %/yr" };
            }
          }
        }

        //symbol == duration
        if (parameter.symbol === "t") {
          if (typeof parameter.input === "number") {
            switch (parameter.units) {
              case "years":
                let newDaysInput = parameter.input * 365;
                return { ...parameter, units: "days", input: newDaysInput };
              case "days":
                let newYearsInput = parameter.input / 365;
                return { ...parameter, units: "years", input: newYearsInput };
            }
          } else {
            switch (parameter.units) {
              case "years":
                return { ...parameter, units: "days" };
              case "days":
                return { ...parameter, units: "years" };
            }
          }
        }
        return parameter;
      } else {
        return parameter;
      }
    });

    //Copy segments, add in new parameters
    let newSegments = segments.map((seg) => {
      return { ...seg };
    });
    newSegments[segmentNumber - 1].parameters = newParameters;

    return setSegments(newSegments);
  };

  const copySegment = () => {
    //Copy original segments
    let segmentsCopy = segments.map((seg) => {
      return { ...seg };
    });

    //Copy the last object in the array
    let newSegment = { ...segments[segments.length - 1] };

    //Define new parameters, zero out the inputs
    let newParameters = newSegment.parameters.map((parameter) => {
      return { ...parameter, input: undefined, calculate: false };
    });
    //Set segmentNumber = prev obj segmentNumber + 1
    newSegment.segmentNumber = segments[segments.length - 1].segmentNumber + 1;

    //add new parameters to new segment
    newSegment.parameters = newParameters;

    segmentsCopy.push(newSegment);

    setSegments(segmentsCopy);

    //add another value to inputsCheck
    let inputCheckCopy = [...inputCheck];

    inputCheckCopy.push(false);

    setInputCheck(inputCheckCopy);
  };

  const deleteSegment = () => {
    //Copy original segments
    let segmentsCopy = segments.map((seg) => {
      return { ...seg };
    });

    let inputCheckCopy = [...inputCheck];

    if (segmentsCopy.length == 1) {
      return;
    } else {
      segmentsCopy.pop();
      inputCheckCopy.pop();
    }

    setSegments(segmentsCopy);
    setInputCheck(inputCheckCopy);
  };

  const countUnknowns = (segment) => {
    let unknowns = [];
    let unknownsCount = 0;

    //Determine parameters to reference

    let params = segment.parameters;

    //For exponential

    if (segment.forecastType === "exponential") {
      let excludeParams = ["b", "df"];
      params
        .filter((param) => !excludeParams.includes(param.symbol))
        .map((param) => {
          if (!param.calculate) {
            unknownsCount += 1;
          }
        });

      // For hyperbolic
    } else if (segment.forecastType === "hyperbolic") {
      params.map((param) => {
        if (!param.calculate) {
          unknownsCount += 1;
        }
      });
    }

    console.log(`this is the unknown count ${unknownsCount}`);
    return unknownsCount;
  };

  const clearInputs = (copySegments) => {
    copySegments = copySegments.map((seg) => {
      let newParameters = seg.parameters.map((param) => {
        if (param.calculate === false) {
          return { ...param, input: undefined };
        } else {
          return { ...param };
        }
      });

      return { ...seg, parameters: newParameters };
    });
    return copySegments;
  };

  const segmentsCheck = () => {
    //Copy original segments
    let copySegments = segments.map((seg) => {
      return { ...seg };
    });

    //map through segments, run tests on each segment
    copySegments = copySegments.map((seg) => {
      //Run countUnknowns function

      let unknownsCount = countUnknowns(seg);
      let errorMessage = [];
      let canCalcUnknowns = false;
      // Checking if all 'Known' parameters are numbers
      seg.parameters
        .filter((param) => param.calculate)
        .map((param) => {
          if (typeof param.input !== "number") {
            errorMessage.push(
              `Parameter ${param.symbol} value ${param.input} is not a valid number`
            );
          }
        });

      //Check if correct amount of Knowns are specified (3 for hyperb)
      if (seg.forecastType === "exponential" && unknownsCount !== 2) {
        errorMessage.push(
          `Invalid combination of knowns and unknowns specified: Expecting 3 knowns, was provided ${
            5 - unknownsCount
          }`
        );
      }
      if (seg.forecastType === "hyperbolic" && unknownsCount === 3) {
        errorMessage.push(
          `Invalid combination of knowns and unknowns specified: Expecting 3 knowns, was provided ${
            5 - unknownsCount
          }`
        );
      }
      // If no errors, set canCalcUnknowns flag to true
      if (errorMessage.length === 0) {
        return {
          ...seg,
          canCalcUnknowns: true,
          errMessage: errorMessage,
        };
      } else {
        return {
          ...seg,
          canCalcUnknowns: false,
          errMessage: errorMessage,
        };
      }
    });

    console.log("end of segmentsCheck");
    console.log(copySegments);
    return copySegments;
  };

  const calculateParameters = () => {
    console.log(`this is the current state inside calculateParameters`);
    console.log(segments);
    let copySegments = segmentsCheck();
    copySegments = clearInputs(copySegments);
    console.log("after running clearInputs");
    console.log(copySegments);

    copySegments = copySegments.map((seg) => {
      let newParameters;
      if (seg.canCalcUnknowns === true) {
        if (seg.forecastType === "exponential") {
          console.log("here");
          console.log(seg.parameters);
          //Define new object using constructor
          const decline = new Exponential(seg.parameters);
          //Use solveUnknowns method
          decline.solveUnknowns();
          console.log(decline);
          //Use exportToArray method
          const parameters = decline.exportToArray();
          console.log("solved decline");
          console.log(parameters);

          // Map through parameters and replace with new parameters
          newParameters = seg.parameters.map((param, index) => {
            return { ...param, input: parameters[index] };
          });
        } else if (seg.forecastType === "hyperbolic") {
          //Define new object using constructor
          const decline = new Hyperbolic(seg.parameters);
          //Use solveUnknowns method
          decline.solveUnknowns();
          //Use exportToArray method
          const parameters = decline.exportToArray();

          // Map through parameters and replace with new parameters
          newParameters = seg.parameters.map((param, index) => {
            return { ...param, input: parameters[index] };
          });
        }
      } else {
        newParameters = seg.parameters.map((param) => {
          if (!param.calculate) {
            return { ...param, input: "" };
          } else {
            return { ...param };
          }
        });
      }
      console.log(newParameters);
      return { ...seg, parameters: newParameters };
    });

    console.log(copySegments);
    setSegments(copySegments);
  };

  return (
    <>
      <div className="ml-12">
        <div className="text-light-grey text-3xl w-[450px] h-[50px] bg-dark-red text-center rounded-md flex justify-center items-center">
          <div className=" bg-dark-red border-2 border-white w-[425px] h-[40px]  ">
            Decline Calculator
          </div>
        </div>
        <div className="flex flex-row space-x-8 pt-4">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="flex flex-col bg-med-grey justify-center items-center max-w-md"
            >
              <div className="flex flex-col w-[450px] h-[450px] items-center">
                <Parameters
                  key={segments[index].segmentNumber}
                  parameters={segments[index].parameters}
                  changeInput={toggleChangeInput}
                  onToggle={toggleCalculate}
                  segmentNumber={segments[index].segmentNumber}
                  segment={segments[index]}
                  toggleUnits={toggleUnits}
                  changeSegmentType={changeSegmentType}
                  clearInputs={clearInputs}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row bg-med-grey w-[450px] h-[50px] items-center justify-center">
          <DeleteSegment deleteSegment={deleteSegment} />
          <AddSegment copySegment={copySegment} />

          <Debug
            calculateParameters={calculateParameters}
            segments={segments}
            segmentsCheck={segmentsCheck}
            countUnknowns={countUnknowns}
          />
        </div>
      </div>
    </>
  );
};

export default App;
