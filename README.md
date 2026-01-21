# T-Ruby WASM

[![npm version](https://badge.fury.io/js/@t-ruby%2Fwasm.svg)](https://www.npmjs.com/package/@t-ruby/wasm)
[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD--2--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)

> [Korean Documentation (한국어 문서)](./README.ko.md)

T-Ruby compiler running in WebAssembly for browser environments. This package allows you to compile T-Ruby (`.trb`) files to Ruby (`.rb`) directly in the browser, making it perfect for documentation playgrounds, online editors, and educational tools.

## What is T-Ruby?

[T-Ruby](https://github.com/type-ruby/t-ruby) is a TypeScript-inspired typed layer for Ruby. It compiles `.trb` files with type annotations into standard `.rb` files and generates `.rbs` type signature files. This package brings that functionality to the browser via WebAssembly.

## Installation

```bash
npm install @t-ruby/wasm
```

## Quick Start

```typescript
import { createTRuby } from '@t-ruby/wasm';

// Initialize the T-Ruby WASM runtime
const tRuby = await createTRuby();

// Compile T-Ruby code
const result = await tRuby.compile(`
  def greet(name: String): String
    "Hello, #{name}!"
  end
`);

if (result.success) {
  console.log(result.ruby);  // Compiled Ruby code
  console.log(result.rbs);   // Generated RBS signatures
} else {
  console.error(result.errors);
}
```

## API Reference

### `createTRuby(options?)`

Creates and initializes a T-Ruby instance. This is the recommended way to get started.

```typescript
const tRuby = await createTRuby({
  debug: false,  // Enable debug logging
  stdout: (text) => console.log(text),   // Custom stdout handler
  stderr: (text) => console.error(text), // Custom stderr handler
});
```

### `TRuby` Class

For more control, you can use the `TRuby` class directly.

```typescript
import { TRuby } from '@t-ruby/wasm';

const tRuby = new TRuby();
await tRuby.initialize();
```

#### `compile(source, filename?)`

Compiles T-Ruby source code to Ruby.

```typescript
const result = await tRuby.compile(`
  interface Greeter
    def greet(name: String): String
  end

  class HelloGreeter
    implements Greeter

    def greet(name: String): String
      "Hello, #{name}!"
    end
  end
`, 'greeter.trb');

console.log(result.ruby);    // Compiled Ruby code
console.log(result.rbs);     // RBS type signatures
console.log(result.errors);  // Compilation errors (if any)
console.log(result.warnings); // Compilation warnings (if any)
```

#### `typeCheck(source, filename?)`

Type checks T-Ruby source code without compiling.

```typescript
const result = await tRuby.typeCheck(`
  def add(a: Integer, b: Integer): Integer
    a + b
  end

  add("not", "integers")
`);

if (!result.valid) {
  result.errors?.forEach(err => {
    console.error(`${err.line}:${err.column} - ${err.message}`);
  });
}
```

#### Virtual File System

Manage files in the virtual file system for multi-file projects.

```typescript
// Add individual files
tRuby.addFile('lib/utils.trb', `
  def helper(x: Integer): Integer
    x * 2
  end
`);

// Add multiple files
tRuby.addFiles([
  { path: 'lib/models.trb', content: '# models' },
  { path: 'lib/services.trb', content: '# services' },
]);

// Get all files
const files = tRuby.getFiles();

// Remove a file
tRuby.removeFile('lib/utils.trb');

// Clear all files
tRuby.clearFiles();
```

#### `getVersion()`

Get version information.

```typescript
const versions = await tRuby.getVersion();
console.log(versions.tRuby);     // T-Ruby version
console.log(versions.ruby);      // Ruby version
console.log(versions.rubyWasm);  // Ruby WASM version
```

#### `eval(code)`

Execute arbitrary Ruby code (for advanced use cases).

```typescript
const result = await tRuby.eval('1 + 2 + 3');
console.log(result); // 6
```

## Types

The package exports the following TypeScript types:

```typescript
import type {
  TRubyOptions,
  CompileResult,
  CompileError,
  CompileWarning,
  TypeCheckResult,
  TypeCheckError,
  VirtualFile,
  VersionInfo,
} from '@t-ruby/wasm';
```

## Browser Usage

### With a Bundler (Vite, Webpack, etc.)

```typescript
import { createTRuby } from '@t-ruby/wasm';

async function main() {
  const tRuby = await createTRuby();
  // Use tRuby...
}

main();
```

### Via CDN (ESM)

```html
<script type="module">
  import { createTRuby } from 'https://esm.sh/@t-ruby/wasm';

  const tRuby = await createTRuby();
  const result = await tRuby.compile('def foo: Integer\n  42\nend');
  console.log(result.ruby);
</script>
```

## Use Cases

- **Documentation Playgrounds**: Let users try T-Ruby code directly in your docs
- **Online Editors**: Build browser-based T-Ruby editors
- **Educational Tools**: Create interactive tutorials for learning T-Ruby
- **Code Preview**: Show compiled output in real-time as users type

## Requirements

- Modern browser with WebAssembly support
- Node.js 18+ (for development/build)

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## License

BSD-2-Clause

## Related Projects

- [T-Ruby](https://github.com/type-ruby/t-ruby) - The T-Ruby compiler (Ruby)
- [ruby.wasm](https://github.com/ruby/ruby.wasm) - Ruby in WebAssembly
