enum FormulaStepAction {
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
}

export class Formula {
  private _methodList: FormulaActionMethod[];

  constructor(methods: FormulaActionMethod[]) {
    this._methodList = methods;
  }

  Run(pitch: number, time: number): number {
    return this._methodList.reduce<number>(
      (currentTotal: number, formula: FormulaActionMethod) => {
        const currentMethodResult = formula.method(pitch, time, currentTotal);
        switch (formula.action) {
          case FormulaStepAction.ADD:
            return currentTotal + currentMethodResult;
          case FormulaStepAction.SUBTRACT:
            return currentTotal - currentMethodResult;
          case FormulaStepAction.MULTIPLY:
            return currentTotal * currentMethodResult;
          case FormulaStepAction.DIVIDE:
            return currentTotal / currentMethodResult;
          default:
            return 0;
        }
      },
      0
    );
  }
}

type FormulaMethod = (
  pitch: number,
  time: number,
  currentValue: number
) => number;

type FormulaActionMethod = {
  method: FormulaMethod;
  action: FormulaStepAction;
};

export class FormulaBuilder {
  private _localStepsStorage: FormulaActionMethod[] = [];

  private append(step: FormulaMethod, action: FormulaStepAction) {
    const actionMethod = {
      method: step,
      action,
    } as FormulaActionMethod;
    this._localStepsStorage.push(actionMethod);
  }

  AddStep(
    step: FormulaMethod,
    action: FormulaStepAction = FormulaStepAction.ADD
  ) {
    this.append(step, action);
    return this;
  }

  Build(): Formula {
    return new Formula(this._localStepsStorage);
  }
}

// Af few pre-programmed formulas
// source: https://dsp.stackexchange.com/questions/46598/mathematical-equation-for-the-sound-wave-that-a-PIano-makes

const { sin, exp, PI } = Math;

export const defaultFormula: Formula = new FormulaBuilder()
  // Base Formula
  .AddStep(
    (pitch, time) =>
      sin(2 * PI * pitch * time) * exp(-0.0004 * 2 * PI * pitch * time)
  )
  // Overtones
  .AddStep(
    (pitch, time) =>
      (sin(2 * 2 * PI * pitch * time) * exp(-0.0004 * 2 * PI * pitch * time)) /
      2
  )
  .AddStep(
    (pitch, time) =>
      (sin(3 * 2 * PI * pitch * time) * exp(-0.0004 * 2 * PI * pitch * time)) /
      4
  )
  .AddStep(
    (pitch, time) =>
      (sin(4 * 2 * PI * pitch * time) * exp(-0.0004 * 2 * PI * pitch * time)) /
      8
  )
  .AddStep(
    (pitch, time) =>
      (sin(5 * 2 * PI * pitch * time) * exp(-0.0004 * 2 * PI * pitch * time)) /
      16
  )
  .AddStep(
    (pitch, time) =>
      (sin(6 * 2 * PI * pitch * time) * exp(-0.0004 * 2 * PI * pitch * time)) /
      32
  )
  // Saturation
  .AddStep((_0, _1, currentValue) => currentValue * currentValue * currentValue)
  // Some magic shit
  .AddStep(
    (_, time) => 1 + 16 * time * exp(-6 * time),
    FormulaStepAction.MULTIPLY
  )
  .Build();
