import { isTypedArray } from "util/types";
import { Exponential } from "../lib/declineEquations";
import { Hyperbolic } from "../lib/declineEquations";
jest.mock("../lib/declineEquations");

beforeEach(() => {
  Exponential.mockClear();
});

describe("Exponential Calculations", () => {
  it("solves for missing qi, q", () => {
    let parameters = [
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
        input: 0.1,
      },

      {
        text: "Final Decline Rate",
        symbol: "df",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
      },

      {
        text: "Segment Duration",
        symbol: "t",
        units: "years",
        calculate: false,
        input: 7.93,
      },

      {
        text: "Segment Reserves",
        symbol: "np",
        units: "mbbl",
        calculate: false,
        input: 2000.0,
      },
      {
        text: "Decline Exponent",
        symbol: "b",
        units: "",
        calculate: false,
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    console.log(decline);
    expect(decline.qi).toBe(1000.0);
    expect(decline.q).toBe(452.59);
  });

  it("solves for missing qi, di", () => {
    let parameters = [
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
        input: 452.43,
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
        input: 7.93,
      },

      {
        text: "Segment Reserves",
        symbol: "np",
        units: "mbbl",
        calculate: false,
        input: 2000.0,
      },
      {
        text: "Decline Exponent",
        symbol: "b",
        units: "",
        calculate: false,
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.qi).toBe(1000.0);
    expect(decline.di).toBe(0.099971);
  });

  it("solves for missing qi, t", () => {
    let parameters = [
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
        input: 452.43,
      },
      {
        text: "Initial Decline Rate",
        symbol: "di",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
      },

      {
        text: "Final Decline Rate",
        symbol: "df",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
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
        input: 2000.0,
      },
      {
        text: "Decline Exponent",
        symbol: "b",
        units: "",
        calculate: false,
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.qi).toBe(1000.0);
    expect(decline.t).toBe(7.93);
  });

  it("solves for missing qi, np", () => {
    let parameters = [
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
        input: 452.43,
      },
      {
        text: "Initial Decline Rate",
        symbol: "di",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
      },

      {
        text: "Final Decline Rate",
        symbol: "df",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
      },

      {
        text: "Segment Duration",
        symbol: "t",
        units: "years",
        calculate: false,
        input: 7.93,
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
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.qi).toBe(1000.0);
    expect(decline.np).toBe(2000);
  });

  it("solves for missing q, di", () => {
    let parameters = [
      {
        text: "Initial Flow Rate",
        symbol: "qi",
        units: "bbl/d",
        calculate: false,
        input: 1000.0,
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
        input: 7.93,
      },

      {
        text: "Segment Reserves",
        symbol: "np",
        units: "mbbl",
        calculate: false,
        input: 2000.0,
      },
      {
        text: "Decline Exponent",
        symbol: "b",
        units: "",
        calculate: false,
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.q).toBe(452.59);
    expect(decline.di).toBe(0.099971);
  });

  it("solves for missing q, t", () => {
    let parameters = [
      {
        text: "Initial Flow Rate",
        symbol: "qi",
        units: "bbl/d",
        calculate: false,
        input: 1000.0,
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
        input: 0.1,
      },

      {
        text: "Final Decline Rate",
        symbol: "df",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
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
        input: 2000.0,
      },
      {
        text: "Decline Exponent",
        symbol: "b",
        units: "",
        calculate: false,
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.q).toBe(452.59);
    expect(decline.t).toBe(7.93);
  });

  it("solves for missing q, np", () => {
    let parameters = [
      {
        text: "Initial Flow Rate",
        symbol: "qi",
        units: "bbl/d",
        calculate: false,
        input: 1000.0,
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
        input: 0.1,
      },

      {
        text: "Final Decline Rate",
        symbol: "df",
        units: "nominal %/yr",
        calculate: false,
        input: 0.1,
      },

      {
        text: "Segment Duration",
        symbol: "t",
        units: "years",
        calculate: false,
        input: 7.93,
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
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.q).toBe(452.59);
    expect(decline.np).toBe(2000);
  });

  it("solves for missing di, t", () => {
    let parameters = [
      {
        text: "Initial Flow Rate",
        symbol: "qi",
        units: "bbl/d",
        calculate: false,
        input: 1000.0,
      },

      {
        text: "Final Flow Rate",
        symbol: "qf",
        units: "bbl/d",
        calculate: false,
        input: 452.43,
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
        input: 2000.0,
      },
      {
        text: "Decline Exponent",
        symbol: "b",
        units: "",
        calculate: false,
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.di).toBe(0.099971);
    expect(decline.t).toBe(7.93);
  });

  it("solves for missing di, np", () => {
    let parameters = [
      {
        text: "Initial Flow Rate",
        symbol: "qi",
        units: "bbl/d",
        calculate: false,
        input: 1000.0,
      },

      {
        text: "Final Flow Rate",
        symbol: "qf",
        units: "bbl/d",
        calculate: false,
        input: 452.43,
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
        input: 7.93,
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
        input: 1.0,
      },
    ];
    let decline = new Exponential(parameters);
    decline.solveUnknowns();
    expect(decline.di).toBe(0.099971);
    expect(decline.np).toBe(2000.0);
  });
});
