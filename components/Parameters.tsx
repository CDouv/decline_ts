import Parameter from "./Parameter";
import SegmentType from "./SegmentType";
export const Parameters = ({
  parameters,
  onToggle,
  changeInput,
  segmentNumber,
  segment,
  toggleUnits,
  changeSegmentType,
  clearInputs,
}) => {
  return (
    <>
      <SegmentType
        key={segmentNumber}
        segment={segment}
        changeSegmentType={changeSegmentType}
        clearInputs={clearInputs}
        segmentNumber={segmentNumber}
      />
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
