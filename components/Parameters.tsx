import Parameter from "./Parameter";

export const Parameters = ({
  parameters,
  onToggle,
  changeInput,
  segmentNumber,
  segment,
  toggleUnits,
  countUnknowns,
}) => {
  let knownsUnknowns = countUnknowns(segmentNumber);

  return (
    <>
      {parameters.map((parameter) => (
        <Parameter
          parameter={parameter}
          key={parameter.symbol}
          onToggle={onToggle}
          changeInput={changeInput}
          segmentNumber={segmentNumber}
          segment={segment}
          toggleUnits={toggleUnits}
        />
      ))}
    </>
  );
};

export default Parameters;
