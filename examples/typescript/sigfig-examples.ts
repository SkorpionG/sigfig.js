// Significant Figures Examples - sigfig.js Package
import { sigfigOf, toSigfig, toPrecision } from "../../src/index.js";

console.log("=== SIGNIFICANT FIGURES EXAMPLES ===\n");

// ============================================================================
// 1. COUNTING SIGNIFICANT FIGURES
// ============================================================================
console.log("📊 1. COUNTING SIGNIFICANT FIGURES (sigfigOf)\n");

console.log("Basic counting:");
console.log(`  sigfigOf(123) = ${sigfigOf(123)}`); // 3 - all non-zero digits
console.log(`  sigfigOf(1.23) = ${sigfigOf(1.23)}`); // 3 - all non-zero digits
console.log(`  sigfigOf(456789) = ${sigfigOf(456789)}`); // 6 - all non-zero digits
console.log();

console.log("Zeros between non-zero digits (significant):");
console.log(`  sigfigOf(101) = ${sigfigOf(101)}`); // 3 - zero between 1 and 1
console.log(`  sigfigOf(1001) = ${sigfigOf(1001)}`); // 4
console.log(`  sigfigOf(5.006) = ${sigfigOf(5.006)}`); // 4
console.log();

console.log("Leading zeros (NOT significant):");
console.log(`  sigfigOf(0.00123) = ${sigfigOf(0.00123)}`); // 3 - leading zeros don't count
console.log(`  sigfigOf(0.0456) = ${sigfigOf(0.0456)}`); // 3
console.log(`  sigfigOf("0.00001") = ${sigfigOf("0.00001")}`); // 1
console.log();

console.log("Trailing zeros after decimal (significant):");
console.log(`  sigfigOf("1.230") = ${sigfigOf("1.230")}`); // 4 - trailing zero is significant
console.log(`  sigfigOf("10.00") = ${sigfigOf("10.00")}`); // 4
console.log(`  sigfigOf("1.0") = ${sigfigOf("1.0")}`); // 2
console.log();

console.log("Trailing zeros in whole numbers (NOT significant):");
console.log(`  sigfigOf(100) = ${sigfigOf(100)}`); // 1 - trailing zeros not significant
console.log(`  sigfigOf(1200) = ${sigfigOf(1200)}`); // 2
console.log(`  sigfigOf(1000) = ${sigfigOf(1000)}`); // 1
console.log();

console.log("Scientific notation (all coefficient digits are significant):");
console.log(`  sigfigOf("1.23e4") = ${sigfigOf("1.23e4")}`); // 3
console.log(`  sigfigOf("5.00e-3") = ${sigfigOf("5.00e-3")}`); // 3
console.log(`  sigfigOf("1.2e10") = ${sigfigOf("1.2e10")}`); // 2
console.log();

// ============================================================================
// 2. FORMATTING TO SIGNIFICANT FIGURES
// ============================================================================
console.log("✨ 2. FORMATTING TO SIGNIFICANT FIGURES (toSigfig)\n");

console.log("Rounding to fewer significant figures:");
console.log(`  toSigfig(123.456, 3) = ${toSigfig(123.456, 3)}`); // "123"
console.log(`  toSigfig(123.456, 4) = ${toSigfig(123.456, 4)}`); // "123.5"
console.log(`  toSigfig(123.456, 5) = ${toSigfig(123.456, 5)}`); // "123.46"
console.log();

console.log("Adding trailing zeros for more significant figures:");
console.log(`  toSigfig(255.5, 5) = ${toSigfig(255.5, 5)}`); // "255.50"
console.log(`  toSigfig(12, 4) = ${toSigfig(12, 4)}`); // "12.00"
console.log(`  toSigfig(5, 3) = ${toSigfig(5, 3)}`); // "5.00"
console.log();

console.log("Small numbers:");
console.log(`  toSigfig(0.001234, 2) = ${toSigfig(0.001234, 2)}`); // "0.0012"
console.log(`  toSigfig(0.001234, 3) = ${toSigfig(0.001234, 3)}`); // "0.00123"
console.log(`  toSigfig(0.001234, 4) = ${toSigfig(0.001234, 4)}`); // "0.001234"
console.log();

console.log("Large numbers (may use scientific notation):");
console.log(`  toSigfig(123456, 3) = ${toSigfig(123456, 3)}`); // "1.23e+5"
console.log(`  toSigfig(123456, 4) = ${toSigfig(123456, 4)}`); // "1.235e+5"
console.log(`  toSigfig(999999, 2) = ${toSigfig(999999, 2)}`); // "1.0e+6"
console.log();

console.log("String inputs (preserves precision):");
console.log(`  toSigfig("123.456", 3) = ${toSigfig("123.456", 3)}`); // "123"
console.log(`  toSigfig("0.001234", 2) = ${toSigfig("0.001234", 2)}`); // "0.0012"
console.log();

// ============================================================================
// 3. USING THE ALIAS (toPrecision)
// ============================================================================
console.log("🔄 3. USING THE ALIAS (toPrecision)\n");

console.log("toPrecision is an alias for toSigfig:");
console.log(`  toPrecision(123.456, 3) = ${toPrecision(123.456, 3)}`); // Same as toSigfig
console.log(`  toPrecision(0.001234, 2) = ${toPrecision(0.001234, 2)}`);
console.log();

// ============================================================================
// 4. PRACTICAL EXAMPLES
// ============================================================================
console.log("💡 4. PRACTICAL EXAMPLES\n");

console.log("Example 1: Laboratory Measurements");
const measurement1: number = 12.345;
const measurement2: number = 12.3;
const measurement3: number = 12;
console.log(`  Measurement 1: ${measurement1} (${sigfigOf(measurement1)} sig figs)`);
console.log(`  Measurement 2: ${measurement2} (${sigfigOf(measurement2)} sig figs)`);
console.log(`  Measurement 3: ${measurement3} (${sigfigOf(measurement3)} sig figs)`);
console.log();

console.log("Example 2: Standardizing Data to 3 Significant Figures");
const data: number[] = [123.456, 0.001234, 9876.54, 0.0999];
console.log("  Original data:", data);
console.log("  Standardized to 3 sig figs:");
data.forEach((value: number) => {
  console.log(`    ${value} → ${toSigfig(value, 3)}`);
});
console.log();

console.log("Example 3: Scientific Constants");
const speedOfLight: number = 299792458; // m/s
const planckConstant: number = 6.62607015e-34; // J⋅s
const avogadroNumber: number = 6.02214076e23; // mol⁻¹

console.log("  Speed of light (3 sig figs):", toSigfig(speedOfLight, 3), "m/s");
console.log("  Planck constant (4 sig figs):", toSigfig(planckConstant, 4), "J⋅s");
console.log("  Avogadro number (5 sig figs):", toSigfig(avogadroNumber, 5), "mol⁻¹");
console.log();

console.log("Example 4: Quality Control - Ensuring Consistent Precision");
const measurements: number[] = [10.123, 10.1, 10.12345, 10];
const targetSigFigs: number = 3;

console.log(`  Standardizing measurements to ${targetSigFigs} significant figures:`);
measurements.forEach((m: number) => {
  const standardized: string = toSigfig(m, targetSigFigs);
  console.log(`    ${m} → ${standardized}`);
});
console.log();

// ============================================================================
// 5. EDGE CASES AND SPECIAL VALUES
// ============================================================================
console.log("⚠️  5. EDGE CASES AND SPECIAL VALUES\n");

console.log("Zero:");
console.log(`  sigfigOf(0) = ${sigfigOf(0)}`); // 1
console.log(`  toSigfig(0, 3) = ${toSigfig(0, 3)}`); // "0"
console.log();

console.log("Very small numbers:");
console.log(`  sigfigOf(0.00000123) = ${sigfigOf(0.00000123)}`);
console.log(`  toSigfig(0.00000123, 2) = ${toSigfig(0.00000123, 2)}`);
console.log();

console.log("Negative numbers:");
console.log(`  sigfigOf(-123.45) = ${sigfigOf(-123.45)}`); // 5
console.log(`  toSigfig(-123.456, 3) = ${toSigfig(-123.456, 3)}`); // "-123"
console.log();

// ============================================================================
// SUMMARY
// ============================================================================
console.log("=".repeat(70));
console.log("📚 SUMMARY\n");
console.log("sigfigOf(value):");
console.log("  • Counts significant figures in a number");
console.log("  • Follows standard scientific rules");
console.log("  • Accepts numbers and strings");
console.log();
console.log("toSigfig(value, sigfigs) / toPrecision(value, sigfigs):");
console.log("  • Formats a number to specified significant figures");
console.log("  • Uses ROUND_HALF_UP rounding (0.5 rounds up)");
console.log("  • Returns a string to preserve precision");
console.log("  • May use scientific notation for very large/small numbers");
console.log("=".repeat(70));
console.log();

console.log("=== Examples Complete! ===\n");
