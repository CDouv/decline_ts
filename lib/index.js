var parameters = {
  qi: 1350.0,
  q: undefined,
  di: 3.5513,
  d: 0.105,
  t: undefined,
  np: undefined,
  b: 0.95,
};

class Hyperbolic {
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

  //Methods to solve for multiple unknown methods

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
}

// Questions for Josh tomorrow:
// I want to take my state in index.tsx and values into the class I have here
//For now, creating a separate object with hard-coded values to work through parser equations

varHyperbolicDecline = new Hyperbolic(parameters);

varHyperbolicDecline.printValues();
varHyperbolicDecline.solveUnknowns();
// varHyperbolicDecline.solve_q_np_t();
varHyperbolicDecline = varHyperbolicDecline.solveUnknowns();

varHyperbolicDecline.printValues();

//Next step - Review Rust code, recreate methods for single variable solving, then methods based on missing three variables
