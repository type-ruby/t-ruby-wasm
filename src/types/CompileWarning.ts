/**
 * Represents a compilation warning from the T-Ruby compiler
 *
 * @remarks
 * Warnings indicate potential issues that don't prevent compilation
 * but may cause unexpected behavior at runtime.
 *
 * @example
 * ```typescript
 * const warning: CompileWarning = {
 *   message: "Unused variable 'x'",
 *   line: 15,
 *   column: 3,
 *   code: "W001"
 * };
 * ```
 */
export interface CompileWarning {
  /** Human-readable warning message */
  message: string;

  /** Line number where the warning occurred (1-indexed) */
  line?: number;

  /** Column number where the warning occurred (1-indexed) */
  column?: number;

  /** Machine-readable warning code for programmatic handling */
  code?: string;
}
