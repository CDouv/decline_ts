var parameters = [
  {
    text: "Initial Flow Rate",
    symbol: "qi",
    units: "bbl/d",
    calculate: false,
    input: 1350.0,
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
    input: 3.5513,
  },

  {
    text: "Final Decline Rate",
    symbol: "df",
    units: "nominal %/yr",
    calculate: false,
    input: 0.1054,
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
    input: 0.95,
  },
];

class Exponential {
  //Write a constructor to create the class from segments state data
  constructor(parameters) {
    this.qi = parameters.qi;
    this.q = parameters.q;
    this.di = parameters.di;
    this.d = parameters.d;
    this.t = parameters.t;
    this.np = parameters.np;
    this.b = parameters.b;
  }
  // Simple print method for QC
  printValues() {
    console.log(
      `Initial Rate: ${this.qi}\nFinal Rate: ${this.q}\nInitial Decline Rate: ${this.di}\nFinal Decline Rate: ${this.d}\nSegment Duration: ${this.t}\nSegment Reserves: ${this.np}\nDecline Exponent: ${this.b}\n`
    );
  }

  // Single Variable Solve Methods

  solve_qi() {
    this.qi = this.q * Math.exp(this.di * this.t);
    return this;
  }

  solve_q() {
    this.q = this.qi / Math.exp(this.di * this.t);
    return this;
  }

  solve_di() {
    this.di = -(Math.log(this.q / this.qi) / this.t);
    return this;
  }

  solve_t() {
    this.t = -(Math.log(this.q / this.qi) / this.di);
    return this;
  }

  solve_np() {
    this.np = (this.qi - this.q) / this.di;
    return this;
  }
  //Bisection

  bisection(func, bounds) {
    var a = bounds[0];
    var b = bounds[1];

    var c = Math.abs((a + b) / 2.0);

    var iteration = 1;

    while (
      Math.abs((func(a) - func(c)) / func(a)) > 0.01 &&
      Math.abs((func(b) - func(c)) / func(b)) > 0.01
    ) {
      if (func(c) === 0) {
        break;
      }

      //Write "match equivalent" statement to determine whether a or b becomes next midpoint
    }
  }
  // Methods to solve for multiple unknown variables

  //Solve unknowns
}
class Hyperbolic {
  //Write a constructor to create the class from segments state data

  constructor(parameters) {
    this.qi = parameters[0].input;
    this.q = parameters[1].input;
    this.di = parameters[2].input;
    this.d = parameters[3].input;
    this.t = parameters[4].input;
    this.np = parameters[5].input;
    this.b = parameters[6].input;
  }
  // Simple print method for QC
  printValues() {
    console.log(
      `Initial Rate: ${this.qi}\nFinal Rate: ${this.q}\nInitial Decline Rate: ${this.di}\nFinal Decline Rate: ${this.d}\nSegment Duration: ${this.t}\nSegment Reserves: ${this.np}\nDecline Exponent: ${this.b}\n`
    );
  }

  // Single Variable Solve Methods
  solve_q() {
    this.q =
      this.qi / (1.0 + this.b * this.di * this.t) ** (1.0 / this.b) / 365.25;
    return this;
  }

  solve_di_1() {
    this.di =
      (this.qi ** this.b *
        (this.q ** (1.0 - this.b) - this.qi ** (1.0 - this.b))) /
      ((this.b - 1.0) * this.np);
    return this;
  }

  solve_di_2() {
    this.di = ((this.qi / this.q) ** this.b - 1.0) / (this.t * this.b);
    return this;
  }

  solve_di_3() {
    this.di = ((this.qi / this.q) ** this.b - 1.0) * this.d + this.d;
    return this;
  }
  solve_d() {
    this.d = this.di / (1.0 + this.b * this.di * this.t);
    return this;
  }

  solve_np() {
    this.np =
      ((this.qi ** this.b / ((this.b - 1.0) * this.di)) *
        (this.q ** (1.0 - this.b) - this.qi ** (1.0 - this.b))) /
      1000.0;
    return this;
  }

  solve_t_1() {
    this.t = (this.di - this.d) / (this.b * this.d * this.di);
    return this;
  }

  solve_t_2() {
    this.t = ((this.qi / this.q) ** this.b - 1.0) / (this.di * this.b);
    return this;
  }

  solve_t_3() {
    this.t = (this.di - this.d) / (this.b * this.d * this.di);
    return this;
  }

  //Methods to solve for multiple unknown variables

  solve_q_np_t() {
    this.solve_t_1();
    this.solve_q();
    this.solve_np();
    return this;
  }
  solve_t_di_d() {
    this.solve_di_1();
    this.solve_t_2();
    this.solve_d();
    return this;
  }
  solve_np_di_d() {
    this.solve_di_2();
    this.solve_d();
    this.solve_np();
    return this;
  }
  solve_np_t_d() {
    this.solve_np();
    this.solve_t_2();
    this.solve_d();
    return this;
  }
  solve_np_t_di() {
    this.solve_di_3();
    this.solve_t_3();
    this.solve_np();
    return this;
  }
  solve_q_np_d() {
    this.solve_q();
    this.solve_np();
    this.solve_d();

    return this;
  }

  //Write a method to use switch statements to choose correct scenario

  solveUnknowns() {
    if (this.q == null && this.np == null && this.t == null) {
      this.solve_q_np_t();
    } else if (this.di == null && this.d == null && this.t == null) {
      this.solve_t_di_d();
    } else if (this.di == null && this.d == null && this.np == null) {
      this.solve_np_di_d();
    } else if (this.d == null && this.t == null && this.np == null) {
      this.solve_np_t_d();
    } else if (this.di == null && this.t == null && this.np == null) {
      this.solve_np_t_di();
    } else if (this.q == null && this.d == null && this.np == null) {
      this.solve_q_np_d();
    } else {
      console.log("NOT SUPPORTED");
    }
    return this;
  }

  exportToArray() {
    const parameters = [];
    parameters[0] = this.qi;
    parameters[1] = this.q;
    parameters[2] = this.di;
    parameters[3] = this.d;
    parameters[4] = this.t;
    parameters[5] = this.np;
    parameters[6] = this.b;

    return parameters;
  }
}

// Questions for Josh tomorrow:
// I want to take my state in index.tsx and values into the class I have here
//For now, creating a separate object with hard-coded values to work through parser equations

//Test scripts
// varHyperbolicDecline = new Hyperbolic(parameters);

// varHyperbolicDecline.printValues();
// varHyperbolicDecline.solveUnknowns();

// const param = varHyperbolicDecline.exportToArray();
// console.log(param);

// varHyperbolicDecline.printValues();

//Next step - Review Rust code, recreate methods for single variable solving, then methods based on missing three variables

export { Exponential, Hyperbolic };
