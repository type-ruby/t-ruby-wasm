import type { CompileError } from "./CompileError.js";
import type { CompileWarning } from "./CompileWarning.js";

/**
 * Result of compiling a T-Ruby (.trb) file
 *
 * @remarks
 * Contains the compiled Ruby code, generated RBS signatures,
 * and any errors or warnings encountered during compilation.
 *
 * @example
 * ```typescript
 * const result: CompileResult = {
 *   success: true,
 *   ruby: "def greet(name)\n  \"Hello, \#{name}!\"\nend",
 *   rbs: "def greet: (String name) -> String"
 * };
 * ```
 */
export interface CompileResult {
  /** Whether the compilation completed without errors */
  success: boolean;

  /** Compiled Ruby code (only present if successful) */
  ruby?: string;

  /** Generated RBS type signature (only present if successful) */
  rbs?: string;

  /** Array of compilation errors (empty if successful) */
  errors?: CompileError[];

  /** Array of compilation warnings (may exist even if successful) */
  warnings?: CompileWarning[];
}
