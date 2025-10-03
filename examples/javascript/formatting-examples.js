// Scientific Formatting Examples
import {
  toScientific,
  toEngineering,
  round,
  percentage,
  truncate,
  digitsAfterDecimal,
  toDigitsAfterDecimal,
} from "../dist/index.js";

console.log("=== Scientific Formatting Examples ===\n");

// Scientific notation
console.log("1. Scientific Notation:");
console.log(`toScientific(1234) = ${toScientific(1234)}`); // 1.234e+3
console.log(`toScientific(0.00123) = ${toScientific(0.00123)}`); // 1.23e-3
console.log(`toScientific(1234, 2) = ${toScientific(1234, 2)}`); // 1.2e+3 (custom sig figs)
console.log(`toScientific(0.000001) = ${toScientific(0.000001)}`); // 1e-6
console.log(`toScientific(6.022e23) = ${toScientific(6.022e23)}`); // 6.022e+23
console.log();

// Engineering notation (powers of 3)
console.log("2. Engineering Notation:");
console.log(`toEngineering(12345) = ${toEngineering(12345)}`); // 12.345e+3
console.log(`toEngineering(0.00123) = ${toEngineering(0.00123)}`); // 1.23e-3
console.log(`toEngineering(1234567) = ${toEngineering(1234567)}`); // 1.234567e+6
console.log(`toEngineering(0.000001) = ${toEngineering(0.000001)}`); // 1e-6
console.log(`toEngineering(1500, 3) = ${toEngineering(1500, 3)}`); // 1.50e+3 (custom sig figs)
console.log();

// Rounding to significant figures
console.log("3. Rounding to Significant Figures:");
console.log(`round(123.456, 3) = ${round(123.456, 3)}`); // 123
console.log(`round(0.001234, 2) = ${round(0.001234, 2)}`); // 0.0012
console.log(`round(1999, 2) = ${round(1999, 2)}`); // 2000
console.log(`round(3.14159, 4) = ${round(3.14159, 4)}`); // 3.142
console.log(`round(0.9999, 3) = ${round(0.9999, 3)}`); // 1.00
console.log();

// Truncating (no rounding)
console.log("4. Truncating to Significant Figures:");
console.log(`truncate(123.999, 3) = ${truncate(123.999, 3)}`); // 123 (vs round: 124)
console.log(`truncate(1999, 2) = ${truncate(1999, 2)}`); // 1900 (vs round: 2000)
console.log(`truncate(3.14159, 4) = ${truncate(3.14159, 4)}`); // 3.141 (vs round: 3.142)
console.log(`truncate(0.9999, 3) = ${truncate(0.9999, 3)}`); // 0.999 (vs round: 1.00)
console.log();

// Percentage calculations
console.log("5. Percentage Calculations:");
console.log(`percentage(25, 100) = ${percentage(25, 100)}%`); // 25%
console.log(`percentage(1, 3) = ${percentage(1, 3)}%`); // 33.3%
console.log(`percentage(1, 3, 2) = ${percentage(1, 3, 2)}%`); // 33% (custom sig figs)
console.log(`percentage(22, 7) = ${percentage(22, 7)}%`); // 314%
console.log(`percentage(0.5, 2) = ${percentage(0.5, 2)}%`); // 25%
console.log();

// Practical examples
console.log("6. Practical Scientific Examples:");
console.log("Physical constants in different formats:");
const speedOfLight = 299792458;
const avogadro = 6.02214076e23;
const planck = 6.62607015e-34;

console.log(`Speed of light: ${speedOfLight} m/s`);
console.log(`  Scientific: ${toScientific(speedOfLight)} m/s`);
console.log(`  Engineering: ${toEngineering(speedOfLight)} m/s`);
console.log();

console.log(`Avogadro's number: ${avogadro}`);
console.log(`  Scientific: ${toScientific(avogadro)} mol⁻¹`);
console.log(`  Engineering: ${toEngineering(avogadro)} mol⁻¹`);
console.log();

console.log(`Planck constant: ${planck} J⋅s`);
console.log(`  Scientific: ${toScientific(planck)} J⋅s`);
console.log(`  Engineering: ${toEngineering(planck)} J⋅s`);
console.log();

console.log("Experimental data formatting:");
console.log(`Gravity: ${round(9.807, 4)} m/s² (rounded to 4 sig figs)`);
console.log(`Temperature: ${round(298.15, 5)} K (rounded to 5 sig figs)`);
console.log(`Voltage: ${round(5.02, 3)} V (rounded to 3 sig figs)`);
console.log();

// Digits after decimal point
console.log("7. Counting Digits After Decimal:");
console.log(`digitsAfterDecimal(3.14159) = ${digitsAfterDecimal(3.14159)}`); // 5
console.log(`digitsAfterDecimal(5) = ${digitsAfterDecimal(5)}`); // 0
console.log(`digitsAfterDecimal("1.230") = ${digitsAfterDecimal("1.230")}`); // 3 (string preserves trailing zeros)
console.log(`digitsAfterDecimal(1.230) = ${digitsAfterDecimal(1.23)}`); // 2 (number doesn't preserve trailing zeros)
console.log();

// Formatting to specific decimal places
console.log("8. Formatting to Specific Decimal Places:");
console.log(`toDigitsAfterDecimal(3.14159, 2) = ${toDigitsAfterDecimal(3.14159, 2)}`); // 3.14
console.log(`toDigitsAfterDecimal(3.14159, 4) = ${toDigitsAfterDecimal(3.14159, 4)}`); // 3.1416 (rounded)
console.log(`toDigitsAfterDecimal(5, 3) = ${toDigitsAfterDecimal(5, 3)}`); // 5 (padded with zeros)
console.log(`toDigitsAfterDecimal(19.999, 2) = ${toDigitsAfterDecimal(19.999, 2)}`); // 20 (rounded)
console.log();

console.log("9. Practical Examples with Decimal Formatting:");
console.log("Currency formatting:");
const price1 = 19.99;
const price2 = 5;
const price3 = 19.999;
console.log(
  `$${toDigitsAfterDecimal(price1, 2)} (${digitsAfterDecimal(price1)} decimal places originally)`
);
console.log(
  `$${toDigitsAfterDecimal(price2, 2)} (${digitsAfterDecimal(price2)} decimal places originally)`
);
console.log(
  `$${toDigitsAfterDecimal(price3, 2)} (${digitsAfterDecimal(price3)} decimal places originally)`
);
console.log();

console.log("Scientific measurements:");
const measurement1 = 9.80665;
const measurement2 = 3.14159265;
console.log(
  `Gravity: ${toDigitsAfterDecimal(measurement1, 4)} m/s² (had ${digitsAfterDecimal(measurement1)} digits)`
);
console.log(
  `Pi: ${toDigitsAfterDecimal(measurement2, 5)} (had ${digitsAfterDecimal(measurement2)} digits)`
);
console.log();

console.log("=== All formatting examples completed! ===\n");
