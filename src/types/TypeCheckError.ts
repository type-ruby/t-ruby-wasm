/**
 * Represents a type checking error from the T-Ruby type checker
 *
 * @remarks
 * Type errors occur when the code violates type constraints,
 * such as passing wrong types to functions or assigning incompatible values.
 *
 * @example
 * ```typescript
 * const error: TypeCheckError = {
 *   message: "Type mismatch in argument",
 *   line: 20,
 *   column: 10,
 *   expected: "Integer",
 *   actual: "String"
 * };
 * ```
 */
export interface TypeCheckError {
  /** Human-readable error message describing the type violation */
  message: string;

  /** Line number where the error occurred (1-indexed) */
  line?: number;

  /** Column number where the error occurred (1-indexed) */
  column?: number;

  /** The expected type at this location */
  expected?: string;

  /** The actual type found at this location */
  actual?: string;
}
