/**
 * Comprehensive tests for significant figure consistency
 * Ensures that sigfigOf(toSigfig(value, n)) === n
 */

import { sigfigOf, toSigfig, toPrecision } from "../src/sigfig";
import { toScientific, toExponential, toFixed } from "../src/formatting";

describe("toSigfig consistency with sigfigOf", () => {
  describe("verifies that sigfigOf(toSigfig(value, n)) === n", () => {
    test("works for regular numbers", () => {
      const testCases = [
        { value: 123.456, sigfigs: 3 },
        { value: 123.456, sigfigs: 4 },
        { value: 123.456, sigfigs: 5 },
        { value: 9876, sigfigs: 2 },
        { value: 9876, sigfigs: 3 },
        { value: 1.234, sigfigs: 2 },
        { value: 1.234, sigfigs: 3 },
        { value: 50.5, sigfigs: 2 },
        { value: 50.5, sigfigs: 3 },
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });

    test("works for small numbers", () => {
      const testCases = [
        { value: 0.001234, sigfigs: 3 },
        { value: 0.00009876, sigfigs: 2 },
        { value: 0.0000001, sigfigs: 1 },
        { value: 0.123, sigfigs: 2 },
        { value: 0.0456, sigfigs: 3 },
        { value: 0.00789, sigfigs: 2 },
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });

    test("works for large numbers (scientific notation)", () => {
      // Large numbers use scientific notation, which preserves sigfigs
      const testCases = [
        { value: 1234567, sigfigs: 3 },
        { value: 9876543, sigfigs: 4 },
        { value: 1000000, sigfigs: 2 },
        { value: 5555555, sigfigs: 5 },
        { value: 12345678, sigfigs: 6 },
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });

    test("works for negative numbers", () => {
      const testCases = [
        { value: -123.456, sigfigs: 3 },
        { value: -0.001234, sigfigs: 2 },
        { value: -9876, sigfigs: 2 },
        { value: -50.5, sigfigs: 3 },
        { value: -0.00456, sigfigs: 2 },
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });

    test("works for numbers that round up (scientific notation)", () => {
      // Numbers that round up and use scientific notation preserve sigfigs
      const testCases = [
        { value: 9999999, sigfigs: 3 }, // Rounds to "1.00e+7"
        { value: 0.0000999, sigfigs: 3 }, // Rounds to "1.00e-4"
        { value: 9876543, sigfigs: 4 }, // Rounds to "9.877e+6"
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });

    test("works for edge cases with decimals", () => {
      // Only test cases where result has decimal point
      const testCases = [
        { value: 0.1, sigfigs: 1 },
        { value: 0.01, sigfigs: 1 },
        { value: 0.001, sigfigs: 1 },
        { value: 1.5, sigfigs: 2 }, // "1.5"
        { value: 12.5, sigfigs: 3 }, // "12.5"
        { value: 0.125, sigfigs: 2 }, // "0.13"
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });

    test("works for numbers with many significant figures", () => {
      const testCases = [
        { value: 123.456789, sigfigs: 6 },
        { value: 123.456789, sigfigs: 7 },
        { value: 123.456789, sigfigs: 8 },
        { value: 0.123456789, sigfigs: 5 },
        { value: 0.123456789, sigfigs: 6 },
      ];

      testCases.forEach(({ value, sigfigs }) => {
        const result = toSigfig(value, sigfigs);
        const resultSigfigs = sigfigOf(result);
        expect(resultSigfigs).toBe(sigfigs);
      });
    });
  });
});

describe("toPrecision alias consistency", () => {
  test("toPrecision behaves identically to toSigfig", () => {
    const testCases = [
      { value: 123.456, sigfigs: 3 },
      { value: 0.001234, sigfigs: 2 },
      { value: 9876543, sigfigs: 4 },
      { value: -50.5, sigfigs: 3 },
    ];

    testCases.forEach(({ value, sigfigs }) => {
      const toSigfigResult = toSigfig(value, sigfigs);
      const toPrecisionResult = toPrecision(value, sigfigs);
      expect(toPrecisionResult).toBe(toSigfigResult);
    });
  });

  test("toPrecision output has correct significant figures", () => {
    const testCases = [
      { value: 255.55, sigfigs: 5 }, // "255.55" has 5 sigfigs
      { value: 123.456, sigfigs: 6 }, // "123.456" has 6 sigfigs
      { value: 0.001234, sigfigs: 3 }, // "1.23e-3" has 3 sigfigs
    ];

    testCases.forEach(({ value, sigfigs }) => {
      const result = toPrecision(value, sigfigs);
      const resultSigfigs = sigfigOf(result);
      expect(resultSigfigs).toBe(sigfigs);
    });
  });
});

describe("toScientific (toExponential alias) behavior", () => {
  test("converts to scientific notation with correct significant figures", () => {
    const testCases = [
      { value: 1234, sigfigs: 4, expected: /^1\.234e\+3$/ },
      { value: 0.00123, sigfigs: 3, expected: /^1\.23e-3$/ },
      { value: 255.5, sigfigs: 4, expected: /^2\.555e\+2$/ },
    ];

    testCases.forEach(({ value, sigfigs, expected }) => {
      const result = toScientific(value, sigfigs);
      expect(result).toMatch(expected);
    });
  });

  test("toExponential alias behaves identically to toScientific", () => {
    const testCases = [
      { value: 1234, sigfigs: 4 },
      { value: 0.00123, sigfigs: 3 },
      { value: 255.5, sigfigs: 4 },
    ];

    testCases.forEach(({ value, sigfigs }) => {
      const scientificResult = toScientific(value, sigfigs);
      const exponentialResult = toExponential(value, sigfigs);
      expect(exponentialResult).toBe(scientificResult);
    });
  });

  test("preserves significant figures in scientific notation", () => {
    const testCases = [
      { value: 255.55, sigfigs: 5 }, // More realistic test
      { value: 1234, sigfigs: 3 },
      { value: 0.001234, sigfigs: 2 },
    ];

    testCases.forEach(({ value, sigfigs }) => {
      const result = toScientific(value, sigfigs);
      // Extract the coefficient from scientific notation
      const match = result.match(/^(-?\d+\.?\d*)e/);
      if (match) {
        const coefficient = match[1];
        const coeffSigfigs = sigfigOf(coefficient);
        expect(coeffSigfigs).toBe(sigfigs);
      }
    });
  });
});

describe("toFixed behavior", () => {
  test("formats with specified decimal places", () => {
    expect(toFixed(3.14159, 2)).toBe("3.14");
    expect(toFixed(3.14159, 4)).toBe("3.1416");
    expect(toFixed(5, 3)).toBe("5.000");
    expect(toFixed(1.2, 4)).toBe("1.2000");
  });

  test("rounds correctly", () => {
    expect(toFixed(3.145, 2)).toBe("3.15"); // Big.js rounds half-up
    expect(toFixed(3.144, 2)).toBe("3.14"); // Rounds down
    expect(toFixed(2.5, 0)).toBe("3"); // Big.js rounds half-up
  });

  test("handles negative numbers", () => {
    expect(toFixed(-3.14159, 2)).toBe("-3.14");
    expect(toFixed(-5.5, 1)).toBe("-5.5");
  });
});

describe("Comprehensive roundtrip tests", () => {
  test("toSigfig -> sigfigOf roundtrip maintains precision for appropriate values", () => {
    // Test values where the sigfig count doesn't exceed the natural precision
    const testCases = [
      { value: 123.456, sigfigs: 5 },
      { value: 123.456, sigfigs: 6 },
      { value: 0.00123, sigfigs: 3 },
      { value: 0.00123, sigfigs: 4 },
      { value: 12345.67, sigfigs: 6 },
      { value: 12345.67, sigfigs: 7 },
    ];

    testCases.forEach(({ value, sigfigs }) => {
      const formatted = toSigfig(value, sigfigs);
      const counted = sigfigOf(formatted);
      expect(counted).toBe(sigfigs);
    });
  });

  test("negative decimal numbers maintain consistency", () => {
    // Test values where the sigfig count doesn't exceed the natural precision
    const testCases = [
      { value: -123.456, sigfigs: 5 },
      { value: -123.456, sigfigs: 6 },
      { value: -0.00123, sigfigs: 3 },
      { value: -0.00123, sigfigs: 4 },
      { value: -12345.67, sigfigs: 6 },
      { value: -12345.67, sigfigs: 7 },
    ];

    testCases.forEach(({ value, sigfigs }) => {
      const formatted = toSigfig(value, sigfigs);
      const counted = sigfigOf(formatted);
      expect(counted).toBe(sigfigs);
    });
  });
});
