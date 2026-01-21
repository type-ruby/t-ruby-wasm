# Contributing to T-Ruby WASM

> [한국어 문서](./CONTRIBUTING.ko.md)

Thank you for your interest in contributing to T-Ruby WASM! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and constructive in all interactions. We welcome contributors of all backgrounds and experience levels.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/t-ruby-wasm.git
   cd t-ruby-wasm
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all source files
- Follow the existing code style
- Each file should have a single export
- Keep files under 100 lines (including comments)
- Write comprehensive JSDoc comments

### SOLID Principles

We follow SOLID principles:

- **S**ingle Responsibility: Each class/module has one responsibility
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes must be substitutable
- **I**nterface Segregation: Keep interfaces small and focused
- **D**ependency Inversion: Depend on abstractions

### DRY Principle

Don't Repeat Yourself. Extract common logic into reusable utilities.

## Testing

### Test-Driven Development (TDD)

We use TDD methodology:

1. Write a failing test first
2. Write the minimum code to pass the test
3. Refactor while keeping tests green

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new functionality
4. Keep commits atomic and well-described
5. Reference any related issues

### Commit Message Format

```
type: short description

Longer description if needed.

Fixes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Project Structure

```
t-ruby-wasm/
├── src/
│   ├── types/           # Type definitions (one per file)
│   ├── vm/              # Ruby VM related code
│   ├── utils/           # Utility functions
│   ├── TRuby.ts         # Main TRuby class
│   ├── createTRuby.ts   # Factory function
│   ├── VirtualFileSystem.ts
│   └── index.ts         # Public exports
├── tests/               # Test files
├── scripts/             # Build scripts
└── dist/                # Build output
```

## Questions?

Feel free to open an issue for questions or discussions.
