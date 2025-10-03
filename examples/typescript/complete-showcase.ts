// Complete Showcase - All Functions in sigfig.js Package
import SigFig from "../../src/index.js";

console.log("=== SIGFIG.JS - Complete Function Showcase ===");
console.log("A TypeScript/JavaScript package for precise mathematical calculations\n");

// ============================================================================
// 1. SIGNIFICANT FIGURES
// ============================================================================
console.log("1. SIGNIFICANT FIGURES\n");

console.log("sigfigOf - Count significant figures:");
console.log(`  sigfigOf(123.45) = ${SigFig.sigfigOf(123.45)}`); // 5
console.log(`  sigfigOf('0.00123') = ${SigFig.sigfigOf("0.00123")}`); // 3
console.log(`  sigfigOf('1.230') = ${SigFig.sigfigOf("1.230")}`); // 4
console.log(`  sigfigOf(100) = ${SigFig.sigfigOf(100)}`); // 1
console.log();

console.log("toSigfig - Format to specific significant figures:");
console.log(`  toSigfig(123.456, 3) = ${SigFig.toSigfig(123.456, 3)}`);
console.log(`  toSigfig(0.001234, 2) = ${SigFig.toSigfig(0.001234, 2)}`);
console.log();

// ============================================================================
// 2. ARITHMETIC OPERATIONS
// ============================================================================
console.log("2. ARITHMETIC OPERATIONS (with significant figure preservation)\n");

console.log("Basic operations:");
console.log(`  add(1.23, 4.5) = ${SigFig.add(1.23, 4.5)}`); // 5.7
console.log(`  sub(10.5, 2.34) = ${SigFig.sub(10.5, 2.34)}`); // 8.2
console.log(`  mul(1.23, 4.5) = ${SigFig.mul(1.23, 4.5)}`); // 5.5
console.log(`  div(10.0, 3.0) = ${SigFig.div(10.0, 3.0)}`); // 3.3
console.log();

console.log("Extended operations:");
console.log(`  mod(17, 5) = ${SigFig.mod(17, 5)}`); // 2
console.log(`  idiv(17, 5) = ${SigFig.idiv(17, 5)}`); // 3
console.log(`  pow(2, 3) = ${SigFig.pow(2, 3)}`); // 8
console.log(`  sqrt(16) = ${SigFig.sqrt(16)}`); // 4
console.log(`  abs(-5.2) = ${SigFig.abs(-5.2)}`); // 5.2
console.log();

console.log("Array operations (with invalid value filtering):");
console.log(`  max([1, 2, 3]) = ${SigFig.max([1, 2, 3])}`); // 3
console.log(`  min([1, 2, 3]) = ${SigFig.min([1, 2, 3])}`); // 1
console.log(`  max([1, "invalid", 3]) = ${SigFig.max([1, "invalid", 3])}`); // 3 (filters invalid)
console.log(`  max([1.234, 1.235], 3) = ${SigFig.max([1.234, 1.235], 3)}`); // 1.24 (compares at 3 sig figs)
console.log();

// ============================================================================
// 3. SCIENTIFIC FORMATTING
// ============================================================================
console.log("3. SCIENTIFIC FORMATTING\n");

console.log("Scientific notation:");
console.log(`  toScientific(1234) = ${SigFig.toScientific(1234)}`);
console.log(`  toScientific(0.00123) = ${SigFig.toScientific(0.00123)}`);
console.log();
console.log("Engineering notation (powers of 3):");
console.log(`  toEngineering(12345) = ${SigFig.toEngineering(12345)}`);
console.log(`  toEngineering(0.00123) = ${SigFig.toEngineering(0.00123)}`);
console.log();

console.log("Rounding and truncating:");
console.log(`  round(123.456, 3) = ${SigFig.round(123.456, 3)}`); // 123
console.log(`  truncate(123.999, 3) = ${SigFig.truncate(123.999, 3)}`); // 123 (no rounding)
console.log();

console.log("Percentage:");
console.log(`  percentage(25, 100) = ${SigFig.percentage(25, 100)}%`);
console.log(`  percentage(1, 3) = ${SigFig.percentage(1, 3)}%`);
console.log();

// ============================================================================
// 5. DECIMAL PLACE UTILITIES
// ============================================================================
console.log("🎯 5. DECIMAL PLACE UTILITIES\n");

console.log("Counting digits after decimal:");
console.log(`  digitsAfterDecimal(3.14159) = ${SigFig.digitsAfterDecimal(3.14159)}`); // 5
console.log(`  digitsAfterDecimal(5) = ${SigFig.digitsAfterDecimal(5)}`); // 0
console.log(`  digitsAfterDecimal("1.230") = ${SigFig.digitsAfterDecimal("1.230")}`); // 3
console.log();

console.log("Formatting to specific decimal places:");
console.log(`  toDigitsAfterDecimal(3.14159, 2) = ${SigFig.toDigitsAfterDecimal(3.14159, 2)}`); // 3.14
console.log(`  toDigitsAfterDecimal(5, 3) = ${SigFig.toDigitsAfterDecimal(5, 3)}`); // 5
console.log(`  toDigitsAfterDecimal(19.999, 2) = ${SigFig.toDigitsAfterDecimal(19.999, 2)}`); // 20
console.log();

// ============================================================================
// 6. PRACTICAL EXAMPLES
// ============================================================================
console.log("💡 6. PRACTICAL EXAMPLES\n");

console.log("Example 1: Scientific Calculation");
const g = 9.80665; // gravity in m/s²
const h = 10.5; // height in meters
const t = SigFig.sqrt(SigFig.div(SigFig.mul(2, h), g));
console.log(`  Time to fall ${h}m: ${t} seconds`);
console.log(`  Formatted: ${SigFig.toDigitsAfterDecimal(t, 2)} seconds`);
console.log();

console.log("Example 2: Currency Calculation");
const prices = [19.99, 5.5, 12.75];
const total = prices.reduce((sum, price) => Number(SigFig.add(sum, price)), 0);
console.log(`  Prices: $${prices.join(", $")}`);
console.log(`  Total: $${SigFig.toDigitsAfterDecimal(total, 2)}`);
console.log();

console.log("Example 3: Data Analysis");
const measurements = [10.1, 10.3, 9.9, 10.2, 10.0];
const maxVal = SigFig.max(measurements);
const minVal = SigFig.min(measurements);
const range = SigFig.sub(maxVal, minVal);
console.log(`  Measurements: [${measurements.join(", ")}]`);
console.log(`  Max: ${maxVal}, Min: ${minVal}, Range: ${range}`);
console.log();

console.log("Example 4: Percentage Calculations");
const score = 85;
const total_points = 100;
const percent = SigFig.percentage(score, total_points);
console.log(`  Score: ${score}/${total_points}`);
console.log(`  Percentage: ${percent}%`);
console.log();

// ============================================================================
// 7. TYPE FLEXIBILITY
// ============================================================================
console.log("🔀 7. TYPE FLEXIBILITY (Numbers and Strings)\n");

console.log("All functions accept both numbers and strings:");
console.log(`  add(1.23, "4.5") = ${SigFig.add(1.23, "4.5")}`);
console.log(`  mul("2", "3") = ${SigFig.mul("2", "3")}`);
console.log(`  toSigfig("123.456", 3) = ${SigFig.toSigfig("123.456", 3)}`);
console.log(`  max(["1", 2, "3"]) = ${SigFig.max(["1", 2, "3"])}`);
console.log();

// ============================================================================
// SUMMARY
// ============================================================================
console.log("=".repeat(70));
console.log("✨ SUMMARY OF AVAILABLE FUNCTIONS\n");
console.log("Significant Figures: sigfigOf, toSigfig");
console.log("Arithmetic: add, sub, mul, div, mod, idiv, pow, sqrt, abs, max, min");
console.log("Formatting: toScientific, toEngineering, round, truncate, percentage");
console.log("Decimal Utils: digitsAfterDecimal, toDigitsAfterDecimal");
console.log(
  "Aliases: plus, minus, times, divide, modulo, power, toPrecision, toExponential, toFixed"
);
console.log();
console.log("All functions:");
console.log("  ✓ Preserve significant figures according to scientific standards");
console.log("  ✓ Accept both number and string inputs");
console.log("  ✓ Include comprehensive error handling");
console.log("  ✓ Are fully type-safe with TypeScript support");
console.log("=".repeat(70));
console.log();

console.log("=== Showcase Complete! ===\n");
