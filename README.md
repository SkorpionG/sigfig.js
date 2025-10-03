# sigfig.js

A TypeScript/JavaScript package for precise mathematical calculations with proper significant figure handling.

[![npm version](https://img.shields.io/npm/v/sigfig.js.svg)](https://www.npmjs.com/package/sigfig.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ES Modules](#es-modules)
  - [Function Aliases](#function-aliases)
  - [Basic Examples](#basic-examples)
- [API Reference](#api-reference)
  - [Significant Figures](#significant-figures)
  - [Arithmetic Operations](#arithmetic-operations)
  - [Scientific Formatting](#scientific-formatting)
- [Standard Significant Figures Rules](#standard-significant-figures-rules)
  - [The Fundamental Rules](#the-fundamental-rules)
  - [Operations Rules](#operations-rules)
- [License](#license)

## Features

- **Significant Figure Counting**: Accurately count significant figures in numbers, strings, and scientific notation
- **Precise Arithmetic**: Perform addition, subtraction, multiplication, division, modulo, power, and more while preserving significant figures according to scientific standards
- **Scientific Formatting**: Format numbers in scientific notation, engineering notation, percentages, rounding, and truncation
- **Flexible Input**: Accept both numbers and strings as input
- **String Output**: All arithmetic and formatting functions return strings to preserve precision
- **TypeScript Support**: Full TypeScript support with type definitions
- **Scientific Standards**: Follows established scientific rules for significant figures
- **Input Validation**: Comprehensive validation for significant figures parameters

## Installation

```bash
npm install sigfig.js
```

## Usage

### ES Modules

```javascript
import {
  sigfigOf,
  toSigfig,
  add,
  sub,
  mul,
  div,
  mod,
  pow,
  sqrt,
  abs,
  max,
  min,
  toScientific,
  toEngineering,
  round,
  truncate,
  percentage,
} from "sigfig.js";

// Or import everything
import SigFig from "sigfig.js";
```

### Function Aliases

For convenience and familiarity, the package provides intuitive aliases for common functions:

```javascript
// Arithmetic aliases (matching big.js naming)
import { plus, minus, times, divide, modulo, power } from "sigfig.js";

plus(0.1, 0.2); // 0.3 (alias for add)
minus(0.3, 0.1); // 0.2 (alias for sub)
times(2, 3); // 6 (alias for mul)
divide(10, 2); // 5 (alias for div)
modulo(10, 3); // 1 (alias for mod)
power(2, 3); // 8 (alias for pow)

// Formatting aliases (matching JavaScript native methods)
import { toPrecision, toExponential, toFixed } from "sigfig.js";

toPrecision(3.14159, 3); // 3.14 (alias for toSigfig)
toExponential(1234); // "1.234e+3" (alias for toScientific)
toFixed(3.14159, 2); // 3.14 (alias for toDigitsAfterDecimal)
```

**Available Aliases:**

- `plus` → `add`
- `minus` → `sub`
- `times` → `mul`
- `divide` → `div`
- `modulo` → `mod`
- `power` → `pow`
- `toPrecision` → `toSigfig`
- `toExponential` → `toScientific`
- `toFixed` → `toDigitsAfterDecimal`

### Basic Examples

```javascript
import {
  sigfigOf,
  toSigfig,
  add,
  mul,
  pow,
  sqrt,
  round,
  truncate,
  toScientific,
  percentage,
} from "sigfig.js";

// Count significant figures
console.log(sigfigOf(123.45)); // 5
console.log(sigfigOf("0.00123")); // 3
console.log(sigfigOf("1.23e-4")); // 3

// Format to significant figures
console.log(toSigfig(123.456, 3)); // "123"
console.log(toSigfig(0.001234, 2)); // "0.0012"

// Arithmetic with significant figures (returns strings)
console.log(add(1.23, 4.5)); // "5.7" (limited by 4.5's 1 decimal place)
console.log(mul(1.23, 4.5)); // "5.5" (limited by 4.5's 2 sig figs)
console.log(pow(2, 3)); // "8"
console.log(sqrt(16)); // "4"

// Rounding and truncation
console.log(round(123.456, 3)); // "123"
console.log(truncate(123.999, 3)); // "123" (no rounding)

// Scientific formatting
console.log(toScientific(1234)); // "1.234e+3"
console.log(percentage(25, 100)); // "25%"
```

## API Reference

### Significant Figures

#### `sigfigOf(value: number | string): number`

Counts the number of significant figures in a number.

**Rules Applied:**

- All non-zero digits are significant
- Zeros between non-zero digits are significant
- Leading zeros are not significant
- Trailing zeros in decimal numbers are significant
- Trailing zeros in whole numbers (without decimal point) are not significant
- All digits in scientific notation coefficients are significant

```javascript
sigfigOf(123); // 3
sigfigOf(1.23); // 3
sigfigOf(0.00123); // 3
sigfigOf("1.23e-4"); // 3
```

#### `toSigfig(value: number | string, sigfigs: number): string`

Formats a number to a specific number of significant figures.

```javascript
toSigfig(255.5, 5); // "255.50"
toSigfig(123.456, 3); // "123"
toSigfig(0.001234, 3); // "0.00123"
```

### Arithmetic Operations

#### `add(a: number | string, b: number | string, toSigfig?: number): string`

Adds two numbers while preserving significant figures. For addition, the result has the same number of decimal places as the least precise operand.

```javascript
add(1.23, 4.5); // "5.7" (1 decimal place from 4.5)
add(1.23, 4.5, 4); // "5.730" (custom: 4 significant figures)
```

#### `sub(a: number | string, b: number | string, toSigfig?: number): string`

Subtracts two numbers while preserving significant figures.

```javascript
sub(10.5, 2.34); // "8.2" (1 decimal place from 10.5)
sub(100, 23.4); // "77" (0 decimal places from 100)
```

#### `mul(a: number | string, b: number | string, toSigfig?: number): string`

Multiplies two numbers while preserving significant figures. For multiplication, the result has the same number of significant figures as the least precise operand.

```javascript
mul(1.23, 4.5); // "5.5" (2 sig figs from 4.5)
mul(2.0, 3.14159); // "6.3" (2 sig figs from 2.0)
```

#### `div(a: number | string, b: number | string, toSigfig?: number): string`

Divides two numbers while preserving significant figures.

```javascript
div(10.0, 3.0); // "3.3" (2 sig figs from minimum)
div(22.0, 7.0, 4); // "3.143" (custom: 4 significant figures)
```

#### `mod(a: number | string, b: number | string, toSigfig?: number): string`

Modulo operation with significant figure handling.

```javascript
mod(17, 5); // "2"
mod(17.5, 5.2); // "2.0"
mod(100, 7, 3); // "2.00" (custom: 3 significant figures)
```

#### `idiv(a: number | string, b: number | string, toSigfig?: number): string`

Integer division (floor division) with significant figure handling.

```javascript
idiv(10, 3); // "3" (floor of 10/3)
idiv(17, 5); // "3"
idiv(-10, 3); // "-4" (floor of -10/3)
```

#### `pow(base: number | string, exponent: number | string, toSigfig?: number): string`

Power operation with significant figure handling.

```javascript
pow(2, 3); // "8" (2^3)
pow(2.5, 2); // "6.3" (2.5^2 = 6.25, rounded to 2 sig figs)
pow(10, 3, 4); // "1.000e+3" (custom: 4 significant figures)
```

#### `sqrt(value: number | string, toSigfig?: number): string`

Square root with significant figure handling.

```javascript
sqrt(9); // "3"
sqrt(2.0); // "1.4" (based on input precision)
sqrt(16, 3); // "4.00" (custom: 3 significant figures)
```

#### `abs(value: number | string, toSigfig?: number): string`

Absolute value with significant figure handling.

```javascript
abs(-5); // "5"
abs(-3.14); // "3.14"
abs(2.5); // "2.5"
```

#### `max(values: (number | string)[], toSigfig?: number): string`

Maximum of two or more numbers with significant figure handling.

```javascript
max([1, 2, 3]); // "3"
max([1.2, 3.4, 2.1]); // "3.4"
max([5.0, 3.14], 2); // "5.0" (custom: 2 significant figures)
```

#### `min(values: (number | string)[], toSigfig?: number): string`

Minimum of two or more numbers with significant figure handling.

```javascript
min([1, 2, 3]); // "1"
min([1.2, 3.4, 2.1]); // "1.2"
min([5.0, 3.14], 3); // "3.14" (custom: 3 significant figures)
```

### Scientific Formatting

#### `toScientific(value: number | string, sigfigs?: number): string`

Formats a number in scientific notation.

```javascript
toScientific(1234); // "1.234e+3"
toScientific(0.00123); // "1.23e-3"
toScientific(1234, 2); // "1.2e+3"
```

#### `toEngineering(value: number | string, sigfigs?: number): string`

Formats a number in engineering notation (powers of 3).

```javascript
toEngineering(12345); // "12.345e+3"
toEngineering(0.00123); // "1.23e-3"
```

#### `round(value: number | string, sigfigs: number, roundingThreshold?: number): string`

Rounds a number to specified significant figures with customizable rounding threshold.

**Parameters:**

- `value`: The number to round
- `sigfigs`: Number of significant figures
- `roundingThreshold` (optional): The digit value (0-9) at which to round up (default: 5)

```javascript
round(123.456, 3); // "123" (default threshold: 5)
round(123.456, 4); // "123.5"
round(0.001234, 2); // "0.0012"

// Custom thresholds
round(123.456, 3, 3); // "124" (4 >= 3, rounds up)
round(123.256, 3, 3); // "123" (2 < 3, rounds down)
round(123.956, 3, 9); // "124" (9 >= 9, rounds up)
```

#### `truncate(value: number | string, sigfigs: number): string`

Truncates a number to specified significant figures (no rounding).

```javascript
truncate(123.999, 3); // "123" (vs round: "124")
truncate(1999, 2); // "1.9e+3"
truncate(0.001234, 2); // "0.0012"
```

#### `percentage(part: number | string, whole: number | string, options?: number | { sigfigs?: number; appendPercent?: boolean }): string`

Calculates percentage with proper significant figure handling.

```javascript
percentage(25, 100); // "25%"
percentage(1, 3); // "33.3%"
percentage(1, 3, 2); // "33%"
percentage(1, 3, { sigfigs: 4 }); // "33.33%"
percentage(1, 3, { appendPercent: false }); // "33.3"
```

#### `toDigitsAfterDecimal(value: number | string, digits: number): string`

Formats a number with a specified number of digits after the decimal point.

```javascript
toDigitsAfterDecimal(3.14159, 2); // "3.14"
toDigitsAfterDecimal(5, 3); // "5.000"
toDigitsAfterDecimal(2.9999, 2); // "3.00"
```

#### `digitsAfterDecimal(value: number | string): number`

Counts the number of digits after the decimal point.

```javascript
digitsAfterDecimal(3.14159); // 5
digitsAfterDecimal(5); // 0
digitsAfterDecimal("1.230"); // 3
```

## Standard Significant Figures Rules

This package follows the standard scientific rules for significant figures:

### The Fundamental Rules

1. **All non-zero digits are always significant**
   - `123` has 3 significant figures
   - `456789` has 6 significant figures

2. **Zeros between non-zero digits are significant**
   - `101` has 3 significant figures (zero between 1 and 1)
   - `1001` has 4 significant figures
   - `5.006` has 4 significant figures

3. **Leading zeros (before the first non-zero digit) are never significant**
   - `0.00123` has 3 significant figures
   - `0.0456` has 3 significant figures

4. **Trailing zeros after a decimal point are significant**
   - `1.230` has 4 significant figures
   - `10.00` has 4 significant figures
   - `1.0` has 2 significant figures

5. **Trailing zeros in a whole number without a decimal point are not significant**
   - `100` has 1 significant figure
   - `1200` has 2 significant figures
   - `100.` has 3 significant figures (decimal point makes them significant)

6. **In scientific notation, all digits in the coefficient are significant**
   - `1.23e4` has 3 significant figures
   - `5.00e-3` has 3 significant figures

### Operations Rules

**Addition & Subtraction**: The result should have the same number of decimal places as the operand with the fewest decimal places.

```javascript
  12.1    (1 decimal place)
+  1.45   (2 decimal places)
-------
  13.6    (result: 1 decimal place)
```

**Multiplication & Division**: The result should have the same number of significant figures as the operand with the fewest significant figures.

```javascript
  2.1  ×  3.456  =  7.3
  (2 sig figs)  (4 sig figs)  (2 sig figs)
```

## License

MIT © [SkorpionG](https://github.com/SkorpionG)
