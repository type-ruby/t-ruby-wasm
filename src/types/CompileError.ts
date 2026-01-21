/**
 * Represents a compilation error from the T-Ruby compiler
 *
 * @remarks
 * Compilation errors occur when the source code contains syntax errors
 * or other issues that prevent successful compilation.
 *
 * @example
 * ```typescript
 * const error: CompileError = {
 *   message: "Unexpected token",
 *   line: 10,
 *   column: 5,
 *   code: "E001"
 * };
 * ```
 */
export interface CompileError {
  /** Human-readable error message describing the issue */
  message: string;

  /** Line number where the error occurred (1-indexed) */
  line?: number;

  /** Column number where the error occurred (1-indexed) */
  column?: number;

  /** Machine-readable error code for programmatic handling */
  code?: string;
}
