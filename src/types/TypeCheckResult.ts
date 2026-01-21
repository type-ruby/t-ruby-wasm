import type { TypeCheckError } from "./TypeCheckError.js";

/**
 * Result of type checking T-Ruby source code
 *
 * @remarks
 * Contains information about whether the type check passed
 * and any type errors found in the source code.
 *
 * @example
 * ```typescript
 * const result: TypeCheckResult = {
 *   valid: false,
 *   errors: [{
 *     message: "Cannot assign String to Integer",
 *     line: 5,
 *     expected: "Integer",
 *     actual: "String"
 *   }]
 * };
 * ```
 */
export interface TypeCheckResult {
  /** Whether the type check passed without errors */
  valid: boolean;

  /** Array of type errors found (empty if valid is true) */
  errors?: TypeCheckError[];
}
