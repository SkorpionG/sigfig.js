// Export significant figure utilities
export {
  sigfigOf,
  toSigfig,
  toPrecision, // Alias for toSigfig
  getDecimalPlacesForAddOrSub,
  getSigfigForMulOrDiv,
} from "./sigfig.js";

// Export formatting utilities
export {
  toScientific,
  toEngineering,
  round,
  percentage,
  truncate,
  digitsAfterDecimal,
  toDigitsAfterDecimal,
  toFixed, // Alias for toDigitsAfterDecimal
  toExponential, // Alias for toScientific
} from "./formatting.js";

// Export arithmetic operations
export {
  add,
  sub,
  mul,
  div,
  mod,
  idiv,
  pow,
  sqrt,
  abs,
  max,
  min,
  // Function aliases
  plus, // Alias for add
  minus, // Alias for sub
  times, // Alias for mul
  divide, // Alias for div
  modulo, // Alias for mod
  power, // Alias for pow
} from "./arithmetic.js";

// Export types for better TypeScript support
export type NumberInput = number | string;

// Import for default export
import { sigfigOf, toSigfig, toPrecision } from "./sigfig.js";
import {
  toScientific,
  toEngineering,
  round,
  percentage,
  truncate,
  digitsAfterDecimal,
  toDigitsAfterDecimal,
  toFixed,
  toExponential,
} from "./formatting.js";
import {
  add,
  sub,
  mul,
  div,
  mod,
  idiv,
  pow,
  sqrt,
  abs,
  max,
  min,
  plus,
  minus,
  times,
  divide,
  modulo,
  power,
} from "./arithmetic.js";

/**
 * Default export containing all sigfig.js functions
 * Provides a convenient namespace for accessing all package functionality
 */
const SigFig = {
  // Significant figures
  sigfigOf,
  toSigfig,
  toPrecision, // Alias for toSigfig

  // Formatting
  toScientific,
  toEngineering,
  round,
  percentage,
  truncate,
  digitsAfterDecimal,
  toDigitsAfterDecimal,
  toFixed, // Alias for toDigitsAfterDecimal
  toExponential, // Alias for toScientific

  // Arithmetic
  add,
  sub,
  mul,
  div,
  mod,
  idiv,
  pow,
  sqrt,
  abs,
  max,
  min,

  // Arithmetic aliases
  plus, // Alias for add
  minus, // Alias for sub
  times, // Alias for mul
  divide, // Alias for div
  modulo, // Alias for mod
  power, // Alias for pow
};

export default SigFig;
