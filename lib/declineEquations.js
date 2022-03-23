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

export class Exponential {
  //Write a constructor to create the class from segments state data
  constructor(parameters) {
    this.qi = parameters[0].input;
    this.q = parameters[1].input;
    this.di = parameters[2].input;
    this.d = parameters[3].input;
    this.t = parameters[4].input;
    this.np = parameters[5].input;
    this.b = 1.0;
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

  // Multiple Variable Solve Methods

  missing_qi_q(q_guess) {
    let result =
      q_guess * 365.25 * Math.exp(this.di * this.t) -
      this.np * 1000.0 * this.di -
      q_guess * 365.25;

    return result;
  }

  missing_qi_di(di_guess) {
    let result =
      di_guess * this.np * 1000.0 -
      this.q * Math.exp(di_guess * this.t) * 365.25 +
      this.q * 365.25;

    return result;
  }

  missing_qi_t(t_guess) {
    let result =
      this.di * t_guess +
      Math.log(
        (this.q * 365.25) / (this.np * 1000.0 * this.di + this.q * 365.25)
      );

    return result;
  }

  missing_qi_np(np_guess) {
    let result =
      np_guess * 1000.0 * this.di -
      this.q * 365.25 * Math.exp(this.di * this.t) +
      this.q * 365.25;

    return result;
  }

  missing_q_di(di_guess) {
    let result =
      di_guess * this.np * 1000.0 -
      this.qi * 365.25 +
      this.qi * 365.25 * Math.exp(-1.0 * di_guess * this.t);

    return result;
  }

  missing_q_t(t_guess) {
    let result =
      this.di * t_guess +
      (this.qi * 365.25 * Math.exp(this.di * t_guess)) / (this.qi * 365.25);

    return result;
  }

  missing_q_np(np_guess) {
    let result =
      this.di * np_guess * 1000.0 -
      this.qi * 365.25 +
      this.qi * 365.25 * Math.exp(this.di * this.t);

    return result;
  }

  missing_di_t(t_guess) {
    let result =
      365.25 * Math.log(this.qi - this.q) * t_guess +
      (this.q / this.qi) * this.np * 1000.0;

    return result;
  }

  missing_di_np(np_guess) {
    let result =
      np_guess * 1000.0 * Math.log(this.q / this.qi) +
      this.t * (this.qi - this.q) * 365.25;

    return result;
  }

  //Bisection

  bisection(func, bounds) {
    // console.log(bounds);
    let a = bounds[0];
    let b = bounds[1];

    let c = Math.abs((a + b) / 2.0);

    let iteration = 1;

    while (
      Math.abs((func(a) - func(c)) / func(a)) > 0.01 &&
      Math.abs((func(b) - func(c)) / func(b)) > 0.01
    ) {
      // console.log("Beginning of iteration #", iteration);
      // console.log(
      //   `a is equal to ${a}\nb is equal to ${b}\nc is equal to ${c}\nf(a) is equal to${func(
      //     a
      //   )}\nf(b) is equal to${func(b)}\nf(c) is equal to${func(c)}\n`
      // );
      if (func(c) === 0) {
        break;
      }

      // if (iteration > 10) {
      //   break;
      // }

      //Write "match equivalent" statement to determine whether a or b becomes next midpoint
      let leftBound = func(a) * func(c);
      let rightBound = func(b) * func(c);
      //Case One : f(a)*f(c) < 0.0 AND f(b)*f(c) <0.0
      if (leftBound < 0.0 && rightBound < 0.0) {
        if (func(a) - func(c) < func(b) - func(c)) {
          b = c;
        } else {
          a = c;
        }
      }

      //Case Two : f(a)*f(c) < 0.0 AND f(b)*f(c) > 0.0
      else if (leftBound < 0.0 && rightBound > 0.0) {
        b = c;
      }
      //Case Three: f(a)*f(c) > 0.0 AND f(b)*f(c) <0.0
      else if (leftBound > 0.0 && rightBound < 0.0) {
        a = c;
      }
      //Case Four: f(a)*f(c) > 0.0 AND f(b)*f(c) > 0.0
      else if (leftBound > 0.0 && rightBound > 0.0) {
        if (func(a) === 0.0) {
          c = a;
          break;
        } else if (func(b) === 0.0) {
          c = b;
          break;
        } else if (func(c) === 0.0) {
          break;
        }
      }

      c = Math.abs((a + b) / 2.0);
      // console.log("End of iteration #", iteration);
      // console.log(
      //   `a is equal to ${a}\nb is equal to ${b}\nc is equal to ${c}\nf(a) is equal to${func(
      //     a
      //   )}\nf(b) is equal to${func(b)}\nf(c) is equal to${func(c)}\n`
      // );
      iteration += 1;
    }
    return c;
  }

  solveUnknowns() {
    let bounds;
    let func;

    if (this.qi === undefined && this.q === undefined) {
      // Scenario 1 - missing qi and q
      //Set bounds for q
      bounds = [0.0, 10000.0];
      func = this.missing_qi_q.bind(this);
      this.q = this.bisection(func, bounds);
      this.solve_qi();
      return this;
    } else if (this.qi === undefined && this.di === undefined) {
      // Scenario 2 - missing qi and di
      //Set bounds for di

      bounds = [0.01, 0.99];
      func = this.missing_qi_di.bind(this);
      this.di = this.bisection(func, bounds);
      this.d = this.di;
      this.solve_qi();
      return this;
    } else if (this.qi === undefined && this.t === undefined) {
      // Scenario 3 - missing qi and t
      // Set bounds for t
      bounds = [0.0, 100.0];
      func = this.missing_qi_t.bind(this);
      this.t = this.bisection(func, bounds);
      this.solve_qi();
      return this;
    } else if (this.qi === undefined && this.np === undefined) {
      // Scenario 4 - missing qi and np
      // Set bounds for np
      bounds = [0.0, 10000.0];
      func = this.missing_qi_np.bind(this);
      this.np = this.bisection(func, bounds);
      this.solve_qi();
      return this;
    } else if (this.q === undefined && this.di === undefined) {
      // Scenario 5 - missing q and di
      // Set bounds for di

      bounds = [0.01, 0.99];
      func = this.missing_q_di.bind(this);
      this.di = this.bisection(func, bounds);
      this.d = this.di;
      this.solve_q();
      return this;
    } else if (this.q === undefined && this.t === undefined) {
      // Scenario 6 - missing q and t
      // Set bounds for t
      bounds = [0.0, 100.0];
      func = this.missing_q_t.bind(this);
      this.t = this.bisection(func, bounds);
      this.solve_q;
      return this;
    } else if (this.q === undefined && this.np === undefined) {
      // Scenario 7 - missing q and np
      // Set bounds for np
      bounds = [0.0, 10000.0];
      func = this.missing_q_np.bind(this);
      this.np = this.bisection(func, bounds);
      this.solve_q();
      return this;
    } else if (this.di === undefined && this.t === undefined) {
      // Scenario 8 - missing di and t
      // Set bounds for t
      bounds = [0.0, 100.0];
      func = this.missing_di_t.bind(this);
      this.t = this.bisection(func, bounds);
      this.solve_di();
      this.d = this.di;
      return this;
    } else if (this.di === undefined && this.np === undefined) {
      // Scenario 9 - missing di and np
      // Set bounds for np
      bounds = [0.0, 10000.0];
      func = this.missing_di_np.bind(this);
      this.np = this.bisection(func, bounds);
      this.solve_di();
      this.d = this.di;
      return this;
    } else {
      // Scenario 10 - missing t and np
      // throw new Error();
    }
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
// Methods to solve for multiple unknown variables

//Solve unknowns

export class Hyperbolic {
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
    if (this.q == undefined && this.np == undefined && this.t == undefined) {
      this.solve_q_np_t();
    } else if (
      this.di == undefined &&
      this.d == undefined &&
      this.t == undefined
    ) {
      this.solve_t_di_d();
    } else if (
      this.di == undefined &&
      this.d == undefined &&
      this.np == undefined
    ) {
      this.solve_np_di_d();
    } else if (
      this.d == undefined &&
      this.t == undefined &&
      this.np == undefined
    ) {
      this.solve_np_t_d();
    } else if (
      this.di == undefined &&
      this.t == undefined &&
      this.np == undefined
    ) {
      this.solve_np_t_di();
    } else if (
      this.q == undefined &&
      this.d == undefined &&
      this.np == undefined
    ) {
      this.solve_q_np_d();
    } else {
      console.log("NOT SUPPORTED");
    }
    // console.log(decline);
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

let decline = new Exponential(parameters);

decline = decline.solveUnknowns();
