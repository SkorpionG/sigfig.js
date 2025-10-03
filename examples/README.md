# sigfig.js Examples

This folder contains examples demonstrating the capabilities of the sigfig.js package in both **JavaScript** and **TypeScript**.

## 📁 Folder Structure

```text
examples/
├── javascript/          # JavaScript examples (ES modules)
│   ├── complete-showcase.js
│   ├── sigfig-examples.js
│   ├── arithmetic-examples.js
│   └── formatting-examples.js
├── typescript/          # TypeScript examples
│   ├── complete-showcase.ts
│   ├── sigfig-examples.ts
│   ├── arithmetic-examples.ts
│   └── formatting-examples.ts
└── README.md
```

## 🚀 Running JavaScript Examples

JavaScript examples use the **compiled dist/** folder.

**First, build the package:**

```bash
npm run build
```

**Then run any JavaScript example:**

```bash
node examples/javascript/complete-showcase.js        # Complete showcase
node examples/javascript/sigfig-examples.js          # Significant figures
node examples/javascript/arithmetic-examples.js      # Arithmetic operations
node examples/javascript/formatting-examples.js      # Scientific formatting
```

## 📘 Running TypeScript Examples

TypeScript examples import directly from **source (src/)** files.

**Option 1: Using ts-node (Recommended)**

```bash
# Install ts-node if you haven't
npm install -g ts-node

# Run TypeScript examples directly
ts-node examples/typescript/complete-showcase.ts
ts-node examples/typescript/sigfig-examples.ts
ts-node examples/typescript/arithmetic-examples.ts
ts-node examples/typescript/formatting-examples.ts
```

**Option 2: Using tsx (Faster)**

```bash
# Install tsx
npm install -g tsx

# Run TypeScript examples
tsx examples/typescript/complete-showcase.ts
tsx examples/typescript/arithmetic-examples.ts
```

**Option 3: Compile and Run**

```bash
# Compile TypeScript examples
tsc examples/typescript/complete-showcase.ts --module esnext --target es2020

# Run compiled JavaScript
node examples/typescript/complete-showcase.js
```

## 📚 Example Categories

### 🎯 Complete Showcase

**Files:** [JavaScript](./javascript/complete-showcase.js) | [TypeScript](./typescript/complete-showcase.ts)

- Complete demonstration of ALL package functions
- Practical examples combining multiple functions
- Type flexibility demonstrations
- Real-world use cases

### Significant Figures

**Files:** [JavaScript](./javascript/sigfig-examples.js) | [TypeScript](./typescript/sigfig-examples.ts)

- Counting significant figures (sigfigOf)
- Formatting to significant figures (toSigfig)
- Understanding the rules for significant figures
- Practical examples with scientific data

### Arithmetic Operations

**Files:** [JavaScript](./javascript/arithmetic-examples.js) | [TypeScript](./typescript/arithmetic-examples.ts)

- Basic arithmetic (add, subtract, multiply, divide)
- Extended operations (modulo, integer division, power, square root)
- Absolute value and array operations (max, min)
- Significant figure preservation in calculations

### Scientific Formatting

**Files:** [JavaScript](./javascript/formatting-examples.js) | [TypeScript](./typescript/formatting-examples.ts)

- Rounding and truncating to significant figures
- Percentage calculations
- Decimal place utilities
- Practical examples with physical constants

## ✨ Key Features Demonstrated

- **Significant Figure Preservation**: All arithmetic operations respect scientific precision rules
- **Type Flexibility**: Functions accept both numbers and strings as input
- **Error Handling**: Comprehensive validation and meaningful error messages
- **Real-World Applications**: Examples show practical use cases in science and engineering

## 📖 Educational Use

These examples are perfect for:

- **Students** learning mathematics, physics, or chemistry
- **Educators** teaching scientific calculation concepts with practical code examples
- **Developers** integrating precise calculations into applications
- **Researchers** needing reliable computational tools with proper significant figure handling

Each example file is self-contained and includes detailed comments explaining the concepts and calculations being performed.
