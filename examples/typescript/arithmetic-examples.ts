// Arithmetic Examples (TypeScript)
import {
  sigfigOf,
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
} from "../../src/index.js";

console.log("=== Arithmetic Operations Examples ===\n");

// Significant Figures
console.log("1. Counting Significant Figures:");
console.log(`sigfigOf(123.45) = ${sigfigOf(123.45)}`);
console.log(`sigfigOf('0.00123') = ${sigfigOf("0.00123")}`);
console.log(`sigfigOf('1.230') = ${sigfigOf("1.230")}`);
console.log(`sigfigOf('1.23e-4') = ${sigfigOf("1.23e-4")}`);
console.log();

// Basic Arithmetic
console.log("2. Addition with Significant Figures:");
console.log(`add(1.23, 4.5) = ${add(1.23, 4.5)}`); // 5.7 (1 decimal place from 4.5)
console.log(`add(123, 4.567) = ${add(123, 4.567)}`); // 128 (0 decimal places from 123)
console.log(`add(1.234, 5.678, 3) = ${add(1.234, 5.678, 3)}`); // 6.91 (custom: 3 significant figures)
console.log();

console.log("3. Subtraction with Significant Figures:");
console.log(`sub(10.5, 2.34) = ${sub(10.5, 2.34)}`); // 8.2 (1 decimal place)
console.log(`sub(500, 23.4) = ${sub(500, 23.4)}`); // 477 (0 decimal places)
console.log();

console.log("4. Multiplication with Significant Figures:");
console.log(`mul(1.23, 4.5) = ${mul(1.23, 4.5)}`); // 5.5 (2 sig figs from 4.5)
console.log(`mul('100', 2.5) = ${mul("100", 2.5)}`); // 300 (1 sig fig from 100)
console.log();

console.log("5. Division with Significant Figures:");
console.log(`div('10.0', '3.0') = ${div("10.0", "3.0")}`); // 3.3 (2 sig figs from minimum)
console.log(`div(15.6, 2.1) = ${div(15.6, 2.1)}`); // 7.4 (2 sig figs from 2.1)
console.log(`div(22.0, 7.0, 4) = ${div(22.0, 7.0, 4)}`); // 3.143 (custom: 4 significant figures)
console.log();

// Extended Arithmetic Operations
console.log("6. Extended Arithmetic Operations:");
console.log(`mod(17, 5) = ${mod(17, 5)}`); // 2 (17 % 5)
console.log(`mod(17.5, 5.2) = ${mod(17.5, 5.2)}`); // 2.0 (with decimals)
console.log(`idiv(17, 5) = ${idiv(17, 5)}`); // 3 (floor division)
console.log(`idiv(-10, 3) = ${idiv(-10, 3)}`); // -4 (floor division with negatives)
console.log();

console.log("7. Power and Root Operations:");
console.log(`pow(2, 3) = ${pow(2, 3)}`); // 8 (2^3)
console.log(`pow(2.5, 2) = ${pow(2.5, 2)}`); // 6.3 (respects sig figs)
console.log(`pow(4, 0.5) = ${pow(4, 0.5)}`); // 2 (square root)
console.log(`sqrt(16) = ${sqrt(16)}`); // 4
console.log(`sqrt(2.0) = ${sqrt(2.0)}`); // 1.4 (respects sig figs)
console.log();

console.log("8. Absolute Value and Array Operations:");
console.log(`abs(-5.2) = ${abs(-5.2)}`); // 5.2
console.log(`abs(-3.14159) = ${abs(-3.14159)}`); // 3.14159
console.log(`max([1.2, 3.4, 2.1]) = ${max([1.2, 3.4, 2.1])}`); // 3.4
console.log(`min([1.2, 3.4, 2.1]) = ${min([1.2, 3.4, 2.1])}`); // 1.2
console.log(`max([5, 1, 9, 3]) = ${max([5, 1, 9, 3])}`); // 9
console.log(`min([-1, -5, -2]) = ${min([-1, -5, -2])}`); // -5
console.log();

console.log("=== All arithmetic examples completed! ===\n");
