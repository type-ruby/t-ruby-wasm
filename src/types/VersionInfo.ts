/**
 * Version information for T-Ruby WASM components
 *
 * @remarks
 * Provides version details for debugging and compatibility checks.
 * Useful when reporting issues or verifying runtime environment.
 *
 * @example
 * ```typescript
 * const versions: VersionInfo = {
 *   tRuby: "1.0.0",
 *   rubyWasm: "2.7.0",
 *   ruby: "3.4.0"
 * };
 * ```
 */
export interface VersionInfo {
  /** T-Ruby compiler version */
  tRuby: string;

  /** Ruby WASM runtime version */
  rubyWasm: string;

  /** Underlying Ruby interpreter version */
  ruby: string;
}
